$(document).ready(function () {

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
        await i.setOption({
            'data': 'value',
            'data2': 'value2',
        });
        let grops = await i.getSoNetGroups({
            'ORDER': {
                'NAME': 'ASC'
            },
            'FILTER': {
            },
            'IS_ADMIN': 'Y'
        });
        console.log('grops', grops);

        await i.getOption();
        await i.getLists({
            'IBLOCK_TYPE_ID': 'lists',
            'IBLOCK_ID': 124
        });

    })().catch(error => console.log('Error:', error));


});
    
