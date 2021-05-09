<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Quick start. Local server-side application with UI</title>
    <script src="/bitrix/js/main/jquery/jquery-3.3.1.min.js"></script>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <script src="bx24-wrapper.js"></script>
    <script src="DataStructure.js?v=1"></script>
    <script src="FilterTasks.js"></script>
    <script src="init.js"></script>
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <div id="name">
        <pre>
		<?php
        require_once(__DIR__ . '/crestcurrent.php');
        require_once(__DIR__ . '/getTasks.php');
        require_once(__DIR__ . '/getTaskFields.php');
        //$result = CRest::call('user.current');
        ///$tasks = new TasksList('2021-3-01', '2021-3-31');
        $fields = new TasksFields();
        $fieldsList = $fields->getFields();
        ?>
		</pre>

    </div>
    <main>
        <aside>
           <!--  <select class='js-add-task-filter'></select>
            <article class='field-task-filter'></article> -->
        </aside>


    </main>
</body>


</html>