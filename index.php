<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Quick start. Local server-side application with UI</title>
    <script src="/bitrix/js/main/jquery/jquery-3.3.1.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://api.bitrix24.com/api/v1/"></script>
    <script src="bx24-wrapper.js"></script>
    <script src="DataStructure.js?v=2"></script>
    <script src="FilterTasks.js"></script>
    <script src="report.js?v=5"></script>
    <script src="init.js?v=7"></script>
    <link rel="stylesheet" href="./style.css">

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <?php
    require_once(__DIR__ . '/crestcurrent.php');
    require_once(__DIR__ . '/getTasks.php');
    require_once(__DIR__ . '/getTaskFields.php');
    //$result = CRest::call('user.current');
    ///$tasks = new TasksList('2021-3-01', '2021-3-31');
    $fields = new TasksFields();
    $fieldsList = $fields->getFields();
    ?>

</head>

<body>
    <header>
        <a>бургер</a>
        <button class="prev">назад</button>
        <select name="mounth">
            <option value="1">Январь</option>
            <option value="2">Февраль</option>
            <option value="3">Март</option>
            <option value="4">Апрель</option>
            <option value="5">Май</option>
            <option value="6">Июнь</option>
            <option value="7">Июль</option>
            <option value="8">Август</option>
            <option value="9">Сентябрь</option>
            <option value="10">Октябрь</option>
            <option value="11">Ноябрь</option>
            <option value="12">Декабрь</option>
        </select>
        <button class="next">вперед</button>
        <select name="year">
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
        </select>
    </header>
    <main>
        <aside>
            <!--  <select class='js-add-task-filter'></select>
            <article class='field-task-filter'></article> -->
        </aside>
        <article class="report-table">
        </article>
    </main>
</body>


</html>
