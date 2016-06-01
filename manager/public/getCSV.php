<?php
	
	header("Content-type: text/plain; charset=UTF-8");
	
	$mysql_hostname = "localhost";
	$mysql_user = "user";
	$mysql_password = "NojiNoji";
	$mysql_database = "CoffeeManager_db";
	$prefix = "";
	$bd = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");

	mysql_select_db($mysql_database, $bd) or die("Could not select database");
		if (isset($_POST['request'])){
    		$dbname='user';
    		$data  = $_POST['request'];

    		$csvFileName = "2015-"+ $data.month + "_" + $data.month + "-" + $data.day + "-" + $data.hours + "-" + $data.minutes+ "-" + $data.seconds + ".csv";

    		$startDate = '2015-' + $month + '-01';
  			$endDate   = '2015-' + $month + '-31';
  			$sql = "select * from test where time >= '" + $startDate + "'and time <= '" + $endDate + "'";
  			$csvSql = $sql + " into outfile '/Users/masakiayano/Desktop/CoffeeManager/public/" + $csvFileName + "' FIELDS TERMINATED BY ',' ";
  
			mysql_query($csvSql,$bd);

			$result = $csvFileName;

			if (!$result) {
    			echo "DB Error, could not list tables\n";
    			echo 'MySQL Error:'.mysql_error();
    			exit;
			}

			echo $result;
			
		}
		else{
    		echo 'The parameter of "request" is not found.';
		}
?>
