<?php

/**
 * 
 */
class TasksFields
{
    private static $dateFrom;
    private static $dateTo;
    public static $result;

    public function __construct()
    {
        self::$result = CRestCurrent::call('tasks.task.getFields', []);
        
    }
    public function getFields() {
        return self::$result['result']['fields'];
    }
}
