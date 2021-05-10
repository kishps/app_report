$(document).ready(function () {
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


    function groupsDescrPrepare(grops,taskkGroups) {
        taskkGroups.total.timeTariff = 0;
        let arrGroupsDescr = grops.map(gr => [prepare(gr.DESCRIPTION), gr.ID]).map(function(el){
            if (Object.keys(el[0]).length==1) {
                //console.log('el[0]', el[0]);
                taskkGroups[`groupId-${el[1]}`].timeTariff = Object.values(el[0])[0]*60;
                taskkGroups.total.timeTariff = taskkGroups.total.timeTariff + Object.values(el[0])[0]*60;
            } else if (Object.keys(el[0]).length > 1) {
                Object.keys(el[0]).map(function(con){
                    if (taskkGroups[con]) {

                        taskkGroups[con].timetariff = el[0][con]*60;
                        taskkGroups.total.timeTariff = taskkGroups.total.timeTariff + el[0][con]*60;;
                    } 
                });
                
            }
        });
       
        return taskkGroups;
    }

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
        console.log(groupsDescrPrepare(grops,taskk.groups));

        /* await i.getOption(); */
        /* await i.getLists({
            'IBLOCK_TYPE_ID': 'lists',
            'IBLOCK_ID': 124
        }); */

    })().catch(error => console.log('Error:', error));


});

