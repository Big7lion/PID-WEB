<?php
	//header("Content-type: text/html; charset=utf-8");
	ini_set('date.timezone','Asia/Shanghai');
    $user = $_GET['user_ID'];
	// $nixie_temp = 80.3;
	$con = mysql_connect('127.0.0.1', 'root', 'cjy24283');
	if (!$con)
	{
		echo json_encode(mysql_error());
	}

	mysql_select_db('Temp_Controller_ID');
	//mysql_query('set names utf8');
    $sql="select * from `parameter_data` where `user_ID`='$user'";

    $query = mysql_query($sql);
	while($row = mysql_fetch_array($query)){
		$data[] = $row;
	}
	echo json_encode($data);
	mysql_close($con);

//     function read_data(){
//     $user = $_POST['user_ID'];
//     $sql="select * from `parameter_data` where `user_ID`=".$user;

//     $query = mysql_query($sql);
// 	while($row = mysql_fetch_array($query)){
// 		$data[] = $row;
// 	}
// 	echo json_encode($data);
// }
?>
