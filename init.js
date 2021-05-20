$(document).ready(function () {
    /**Разбор описания групппы и извлечение тарифного времени */
    function prepare(strr) {
        let arrDescr = [];
        strr.split(')').map(element => element.split('(')).map(el => el.map(function (ell) {
            if ((ell.includes('|'))) arrDescr.push(ell);
        }))
        let objResult = {};
        let res = arrDescr.map(function (ele) {
            //console.log('ele', ele);
            return ele.split(' ');
        }).map(function (el1) {
            let hours, contract;
            el1.map(function (el2) {

                if (el2.includes(':')) {
                    hours = el2.slice(el2.indexOf(':') + 1);
                } else if (el2.includes('-')) {
                    contract = el2;
                }
            });
            objResult[contract] = hours;
        });

        return objResult;
    }

    /**добавление в группы тарифного времени */ 
    function groupsDescrPrepare(grops, taskkGroups) {
        taskkGroups.total.timeTariff = 0;
        let arrGroupsDescr = grops.map(gr => [prepare(gr.DESCRIPTION), gr.ID]).map(function (el) {
            if (Object.keys(el[0]).length == 1) {
                
                if (taskkGroups[`groupId-${el[1]}`]) {
                    taskkGroups[`groupId-${el[1]}`].timeTariff = Object.values(el[0])[0] * 60;
                    taskkGroups.total.timeTariff = taskkGroups.total.timeTariff + Object.values(el[0])[0] * 60;
                } else {
                    taskkGroups[Object.keys(el[0])[0]].timeTariff = Object.values(el[0])[0] * 60;
                    taskkGroups.total.timeTariff = taskkGroups.total.timeTariff + Object.values(el[0])[0] * 60;
                }
            } else if (Object.keys(el[0]).length > 1) {
                Object.keys(el[0]).map(function (con) {
/*                     console.log('con', con);
                    console.log('taskkGroups', taskkGroups);
                    console.log('el[0][con] * 60', el[0][con] * 60); */
                    if (taskkGroups[con]) {

                        taskkGroups[con].timeTariff = el[0][con] * 60;
                        taskkGroups.total.timeTariff = taskkGroups.total.timeTariff + el[0][con] * 60;
                    }
                });

            }
        });
        console.log('taskkGroups', taskkGroups);
        return taskkGroups;
    }

    /**Установка значений фильтра и создание табличного отчета */
    async function setSettingAndRender(params) {
        let mounth = params.mounth;
        let year = params.year;
        let i = new DataStructure('task');

        let lastDay = i.lastDayOfMounth({year: year, mounth:mounth})

        i.setArrFilters({ // три фильтра для задач
            0: { // текущие
                ">=DEADLINE": `${year}-${mounth}-01`,
                "<=DEADLINE": `${year}-${mounth}-${lastDay}`,
                "<=REAL_STATUS": 4,
                TITLE: "%ТП:%"

            },
            1: { //закрытые
                ">=CLOSED_DATE": `${year}-${mounth}-01`,
                "<=CLOSED_DATE": `${year}-${mounth}-${lastDay}`,
                "UF_AUTO_817165109357": '',
                TITLE: "%ТП:%"
            },
            3: { //закрытые в другом месяце
                "UF_AUTO_817165109357": `${year}-${mounth}`,
                TITLE: "%ТП:%"
            }
        });
        i.setArrSelect([ //доступные поля
            'ID', 'TITLE', 'DESCRIPTION', 'STATUS', 'NOT_VIEWED', 'GROUP_ID', 'STAGE_ID', 'CREATED_BY',
            'CREATED_DATE', 'RESPONSIBLE_ID', 'ACCOMPLICES', 'AUDITORS', 'CHANGED_BY', 'CHANGED_DATE', 'REAL_STATUS',
            'STATUS_CHANGED_DATE', 'CLOSED_BY', 'CLOSED_DATE', 'DATE_START', 'DEADLINE', 'END_DATE_PLAN',
            'NEW_COMMENTS_COUNT', 'TASK_CONTROL', 'TIME_ESTIMATE', 'TIME_SPENT_IN_LOGS', 'DURATION_PLAN', 'DURATION_FACT',
            'UF_AUTO_764963900303', "UF_AUTO_817165109357"
        ]);
        let taskk = await i.getTasks();
        console.log('taskk', taskk);
        /* await i.setOption({
            'data': 'value',
            'data2': 'value2',
        }); */
        let arrGroupsId = Object.values(taskk.groups).map(group => group.id); console.log('arrGroupsId', arrGroupsId);
        let grops = await i.getSoNetGroups({
            'ORDER': {
                'NAME': 'ASC'
            },
            'FILTER': {
                'ID': arrGroupsId
            },
            'IS_ADMIN': 'Y'
        });
		console.log('grops', grops);

        /* await i.getOption(); */
        /* await i.getLists({
            'IBLOCK_TYPE_ID': 'lists',
            'IBLOCK_ID': 124
        }); */

        let rep = new ReportTable();
        rep.setData({
            tasks: taskk.groupedTasks,
            groups: groupsDescrPrepare(grops, taskk.groups)
        });
        rep.renderReport();

    }

    $('select[name="mounth"]').change(function () {
        let mounth = $(this).val();
        let year = $('select[name="year"]').val();
        (async () => {
            setSettingAndRender({
                mounth: mounth,
                year: year
            });
        })().catch(error => console.log('Error:', error));
    });

    $('select[name="year"]').change(function () {
        let mounth = $('select[name="mounth"]').val();
        let year = $(this).val();
        (async () => {
            setSettingAndRender({
                mounth: mounth,
                year: year
            });
        })().catch(error => console.log('Error:', error));
    });

    $(document).ready(function(){ 
        let mounth = $('select[name="mounth"]').val();
        let year = $('select[name="year"]').val();
        (async () => {
            setSettingAndRender({
                mounth: mounth,
                year: year
            });
        })().catch(error => console.log('Error:', error));
    });
    


});

