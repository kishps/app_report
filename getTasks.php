<?php

/**
 * 
 */
class TasksList
{
    private static $dateFrom;
    private static $dateTo;
    public static $result;

    public function __construct($dateFrom, $dateTo)
    {
        self::$dateFrom = $dateFrom;
        self::$dateFrom = $dateTo;
        self::$result = CRestCurrent::call('tasks.task.list', [
            'order' => ['GROUP_ID' => "asc"],
            'filter' => [
                "<=DEADLINE" => $dateTo,
                "<=REAL_STATUS" => 4,
                'TITLE' => "%ТП:%"
            ],
            'select' => [
                'ID', 'TITLE', 'DESCRIPTION', 'STATUS', 'NOT_VIEWED', 'GROUP_ID', 'STAGE_ID', 'CREATED_BY',
                'CREATED_DATE', 'RESPONSIBLE_ID', 'ACCOMPLICES', 'AUDITORS', 'CHANGED_BY', 'CHANGED_DATE',
                'STATUS_CHANGED_DATE', 'CLOSED_BY', 'CLOSED_DATE', 'DATE_START', 'DEADLINE', 'END_DATE_PLAN',
                'NEW_COMMENTS_COUNT', 'TASK_CONTROL', 'TIME_ESTIMATE', 'TIME_SPENT_IN_LOGS', 'DURATION_PLAN', 'DURATION_FACT',
                'UF_AUTO_764963900303', "UF_AUTO_817165109357"
            ]
        ]);
    }

    public function getResult()
    {
        return self::$result;
    }
}
