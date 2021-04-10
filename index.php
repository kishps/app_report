<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Quick start. Local server-side application with UI</title>
	<script src="/bitrix/js/main/jquery/jquery-3.3.1.min.js"></script>
	<script src="//api.bitrix24.com/api/v1/"></script>
	<script src="bx24-wrapper.js"></script>
</head>

<body>
	<button id="push">отправить данные</button>
	<div id="auth-data">OAuth 2.0 data from REQUEST:
		<pre><?php
				print_r($_REQUEST);
				?>
		</pre>
	</div>
	<div id="name">
		<pre>
		<?php
		require_once(__DIR__ . '/crestcurrent.php');
		require_once(__DIR__ . '/getTasks.php');
		//$result = CRest::call('user.current');
		$tasks = new TasksList('2021-3-01', '2021-3-31');
		//print_r($tasks->getResult());
		?>
		</pre>
	</div>
</body>
<script>
	class DataStructure {
		_arrTasks = []; // массив задач

		sourseGroups = 'description'; //источник настроек
		dataGrouping = {
			default: 'groupId',
			groupingUf: 'ufAuto764963900303'
		}; //группировка
		arrTargetProperty = [
			'durationFact',
			'durationPlan',
			'timeEstimate'
		]; // целевое свойство для калькуляции

		_resultData = {
			groupedTasks: {},
			groups: {}
		}; //конечный результат

		/*arrFilters = { // три фильтра для задач
			0: { // текущие
				">=DEADLINE": '2021-3-01',
				"<=DEADLINE": '2021-3-31',
				"<=REAL_STATUS": 4,
				TITLE: "%ТП:%"

			},
			1: { //закрытые
				">=CLOSED_DATE": '2021-3-01',
				"<=CLOSED_DATE": '2021-3-31',
				"UF_AUTO_817165109357": '',
				TITLE: "%ТП:%"
			},
			3: { //закрытые в другом месяце
				"UF_AUTO_817165109357": yyyy_mm,
				TITLE: "%ТП:%"
			}
		}*/

		/*arrSelect = [ //доступные поля
			'ID', 'TITLE', 'DESCRIPTION', 'STATUS', 'NOT_VIEWED', 'GROUP_ID', 'STAGE_ID', 'CREATED_BY',
			'CREATED_DATE', 'RESPONSIBLE_ID', 'ACCOMPLICES', 'AUDITORS', 'CHANGED_BY', 'CHANGED_DATE',
			'STATUS_CHANGED_DATE', 'CLOSED_BY', 'CLOSED_DATE', 'DATE_START', 'DEADLINE', 'END_DATE_PLAN',
			'NEW_COMMENTS_COUNT', 'TASK_CONTROL', 'TIME_ESTIMATE', 'TIME_SPENT_IN_LOGS', 'DURATION_PLAN', 'DURATION_FACT',
			'UF_AUTO_764963900303', "UF_AUTO_817165109357"
		]*/


		constructor(entityType) {
			this.entityType = entityType; // тип сущности
		}

		/**
		 * Установка значений фильтров выборки задач
		 * @param {Object} arrFilters фильтры
		 */
		setArrFilters(arrFilters) {
			this.arrFilters = arrFilters;
		}

		/**
		 * Установка значений доступных полей выборки задач
		 * @param {Object} arrSelect доступные поля
		 */
		setArrSelect(arrSelect) {
			this.arrSelect = arrSelect;
		}

		setSourseGroups(sourseGroups) {
			this.setSourseGroups = sourseGroups; //источник настроек сейчас 'description'
		}

		setDataGrouping(dataGrouping) {
			this.dataGrouping = dataGrouping; //группировка сейчас  {default: 'groupId',groupingUf: 'ufAuto764963900303'}
		}

		setArrTargetProperty(arrTargetProperty) {
			this.arrTargetProperty = arrTargetProperty; // целевое свойство для калькуляции сейчас ['durationfact', 'durationPlan','timeEstimate']
		}

		async getTasks() {
			let bx24 = new BX24Wrapper();
			bx24.progress = percent => console.log(`progress: ${percent}%`);
			let arrTasks = [];

			for (let keyFilter in this.arrFilters) {


				let params = {
					order: {
						GROUP_ID: "asc"
					},
					filter: this.arrFilters[keyFilter],
					select: this.arrSelect
				};
				//console.log('params:', params);

				let resultTasks = await bx24.callListMethod('tasks.task.list', params);
				for (let tasks of resultTasks) {
					arrTasks = arrTasks.concat(tasks.tasks);
				}
			}
			//console.log('arrTasks:', arrTasks);
			this._arrTasks = arrTasks;

			this.foreachTasks();
			return this._resultData;
		}

		foreachTasks() {
			for (let taskItem in this._arrTasks) {
				let paramGrouping;
				if (this._arrTasks[taskItem][this.dataGrouping.groupingUf]) {
					paramGrouping = this._arrTasks[taskItem][this.dataGrouping.groupingUf];
				} else {
					paramGrouping = `${this.dataGrouping.default}-${this._arrTasks[taskItem][this.dataGrouping.default]}`;
				}

				this.addElementInStucture({
					groupFor: paramGrouping,
					task: this._arrTasks[taskItem]
				});
			}
		}


		addTaskInStucture(params) {
			/*addElementInStucture({
					groupFor: paramGrouping,
					task: this._arrTasks[taskItem]
			});
			*/
			let task = params.task;
			let groupFor = params.groupFor;


			if (!(this._resultData.groupedTasks[groupFor])) {
				this._resultData.groupedTasks[groupFor] = [task];
			} else {
				this._resultData.groupedTasks[groupFor].push(task);
			}


			if (!(this._resultData.groups[groupFor])) {
				this._resultData.groups[groupFor] = {};
				this._resultData.groups[groupFor]['count'] = 1;
				if (this.arrTargetProperty) {
					for (let property of this.arrTargetProperty) {
						this._resultData.groups[groupFor][property] = (task[property]) ? parseInt(task[property]) : 0;
					}
				}
			} else if (this._resultData.groups[groupFor] && (this._resultData.groups[groupFor]['count'] > 0)) {
				this._resultData.groups[groupFor]['count']++;
				if (this.arrTargetProperty) {
					for (let property of this.arrTargetProperty) {
						this._resultData.groups[groupFor][property] += (task[property]) ? parseInt(task[property]) : 0;
					}
				}
			} else {
				console.log('Error!!! this._resultData.groups[groupFor]', this._resultData.groups[groupFor]);
			}


			if (!(this._resultData.groups.total)) {
				this._resultData.groups.total = {};
				this._resultData.groups.total['count'] = 1;
				if (this.arrTargetProperty) {
					for (let property of this.arrTargetProperty) {
						this._resultData.groups.total[property] = (task[property]) ? parseInt(task[property]) : 0;
						
						
					}
				}
			} else if (this._resultData.groups.total && (this._resultData.groups.total['count'] > 0)) {
				this._resultData.groups.total['count']++;
				if (this.arrTargetProperty) {
					for (let property of this.arrTargetProperty) {

						this._resultData.groups.total[property] = parseInt(this._resultData.groups.total[property]) + ((task[property]>0) ? parseInt(task[property]) : 0);
						
						
					}
				}
			} else {
				console.log('Error!!! this._resultData.groups[groupFor]', this._resultData.groups[groupFor]);
			}
		}


	}



	$(document).ready(function() {
		$('#push').on("click", function() {

			(async () => {
				let i = new DataStructure('task');
				i.setArrFilters({ // три фильтра для задач
					0: { // текущие
						">=DEADLINE": '2021-3-01',
						"<=DEADLINE": '2021-3-31',
						"<=REAL_STATUS": 4,
						TITLE: "%ТП:%"

					},
					1: { //закрытые
						">=CLOSED_DATE": '2021-3-01',
						"<=CLOSED_DATE": '2021-3-31',
						"UF_AUTO_817165109357": '',
						TITLE: "%ТП:%"
					},
					3: { //закрытые в другом месяце
						"UF_AUTO_817165109357": '2021-3',
						TITLE: "%ТП:%"
					}
				});
				i.setArrSelect([ //доступные поля
					'ID', 'TITLE', 'DESCRIPTION', 'STATUS', 'NOT_VIEWED', 'GROUP_ID', 'STAGE_ID', 'CREATED_BY',
					'CREATED_DATE', 'RESPONSIBLE_ID', 'ACCOMPLICES', 'AUDITORS', 'CHANGED_BY', 'CHANGED_DATE',
					'STATUS_CHANGED_DATE', 'CLOSED_BY', 'CLOSED_DATE', 'DATE_START', 'DEADLINE', 'END_DATE_PLAN',
					'NEW_COMMENTS_COUNT', 'TASK_CONTROL', 'TIME_ESTIMATE', 'TIME_SPENT_IN_LOGS', 'DURATION_PLAN', 'DURATION_FACT',
					'UF_AUTO_764963900303', "UF_AUTO_817165109357"
				]);
				let taskk = await i.getTasks();
				console.log('result', taskk);

			})().catch(error => console.log('Error:', error));


		});
		$('#push').click();
	});
</script>

</html>