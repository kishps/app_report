class DataStructure {
    _arrTasks = []; // массив задач
    _arrLists = []; //массив списков
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


    /**
     * Получить список задач с заданным фильтром
     */
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

    /**@description перебрать все полученные задачи */
    foreachTasks() {
        for (let taskItem in this._arrTasks) {
            let paramGrouping;
            if (this._arrTasks[taskItem][this.dataGrouping.groupingUf]) {
                paramGrouping = this._arrTasks[taskItem][this.dataGrouping.groupingUf];
            } else {
                paramGrouping = `${this.dataGrouping.default}-${this._arrTasks[taskItem][this.dataGrouping.default]}`;
            }

            this.addTaskInStucture({
                groupFor: paramGrouping,
                task: this._arrTasks[taskItem]
            });
        }
    }

    /**@description добавить задачу в структуру данных */
    addTaskInStucture(params) {
        /*addTaskInStucture({
                groupFor: paramGrouping,
                task: this._arrTasks[taskItem]
        });
        */
        let task = params.task;
        let groupFor = params.groupFor;

        //добавление задачи в группу
        if (!(this._resultData.groupedTasks[groupFor])) {
            this._resultData.groupedTasks[groupFor] = [task];
        } else {
            this._resultData.groupedTasks[groupFor].push(task);
        }

        //рассчет суммы свойств по группам
        if (!(this._resultData.groups[groupFor])) {
            this._resultData.groups[groupFor] = {};
            this._resultData.groups[groupFor]['count'] = 1;
            this._resultData.groups[groupFor]['id'] = task.group.id;
            this._resultData.groups[groupFor]['name'] = task.group.name;
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

        //рассчет общей суммы свойств
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

                    this._resultData.groups.total[property] = parseInt(this._resultData.groups.total[property]) + ((task[property] > 0) ? parseInt(task[property]) : 0);


                }
            }
        } else {
            console.log('Error!!! this._resultData.groups[groupFor]', this._resultData.groups[groupFor]);
        }
    }

    async getLists(params) {
        let bx24 = new BX24Wrapper();
        bx24.progress = percent => console.log(`progress: ${percent}%`);
        // let arrLists = [];


        //console.log('params:', params);

        let resultLists = await bx24.callListMethod('lists.element.get', params);
        console.log('resultLists:', resultLists);
        this._arrLists = resultLists;

        return this._arrLists;
    }

    /**
     * Получить список групп
     */
    async getSoNetGroups(params) {
        let bx24 = new BX24Wrapper();
        bx24.progress = percent => console.log(`progress: ${percent}%`);
        // let arrLists = [];

        //console.log('params:', params);

        let resultLists = await bx24.callListMethod('sonet_group.get', params);
        console.log('resultLists:', resultLists);
        this._arrLists = resultLists;

        return this._arrLists;
    }


    async setOption(options = {}) {
        let bx24 = new BX24Wrapper();
        bx24.progress = percent => console.log(`progress: ${percent}%`);
        let arrOptions = {
            "options": options
        };
        let result = await bx24.callListMethod('app.option.set', arrOptions);
        console.log('result', result);
        //return result;
    }

    async getOption() {
        let bx24 = new BX24Wrapper();
        bx24.progress = percent => console.log(`progress: ${percent}%`);
        let arrOptions = [];
        let result = await bx24.callMethod('app.option.get', arrOptions);
        console.log('result', result);
        //return result;
    }

}