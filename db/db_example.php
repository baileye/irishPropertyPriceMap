<?php 

function setupDB() {
	// LOCAL TESTING
	$username = "root";
	$password = "password";
	$hostname = "127.0.0.1";

	$dbh = new PDO("mysql:host=".$hostname.";dbname=propertyPriceList", $username, $password,array(PDO::ATTR_PERSISTENT => true));
	
	return $dbh;
}
?>