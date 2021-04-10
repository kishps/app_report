<?php
		require_once(__DIR__ . '/crestcurrent.php');
		require_once(__DIR__ . '/getTasks.php');
		//$result = CRest::call('user.current');
		$tasks = new TasksList('2021-2-01', '2021-2-31');
		print_r($tasks->getResult());
		?>
