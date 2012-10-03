<?php 

include_once 'db.php';
// For testing
// loadData();
// loadResales();

function getCountyLng($county) {
	// HARDCODE CENTRE POINTS FOR EACH COUNTY
	$countyCentreLng = array('Carlow' => -6.639060602204895, 'Cavan' => -7.384363960181241, 'Clare' => -9.053929917083167, 'Cork' => -8.767626325093787, 'Donegal' => -7.810050587235405, 'Dublin' => -6.182282354304998, 'Galway' => -8.848624424989035, 'Kerry' => -9.484158391654546, 'Kildare' => -6.712813191628015, 'Kilkenny' =>  -7.222, 'Laois' => -7.291800289343525, 'Leitrim' => -8.008089421474361, 'Limerick' => -8.787354141584112, 'Longford' => -7.723890325056852, 'Louth' => -6.354730750000162, 'Mayo' => -9.234437568574421, 'Meath' => -6.682710353970941, 'Monaghan' => -6.957325667430411, 'Offaly' => -7.594751208536977, 'Roscommon' => -8.419359901202384, 'Sligo' => -8.651560623783681, 'Tipperary' => -7.963255599483981, 'Waterford' => -7.54235121341091, 'Westmeath' => -7.433043569379128, 'Wexford' => -6.600126373256516, 'Wicklow' => -6.363508310437226);

	return $countyCentreLng[$county];
}
function getCountyLat($county) {
	$countyCentreLat = array('Carlow' => 52.68728928615819, 'Cavan' => 54.04895405684413, 'Clare' => 52.90338059063327, 'Cork' => 51.9429324681509, 'Donegal' => 54.91433649265373, 'Dublin' => 53.2716570625575, 'Galway' => 53.32774241474017, 'Kerry' => 52.10744191747443, 'Kildare' => 53.15064771894795, 'Kilkenny' => 52.52081705587384, 'Laois' => 52.9971117892623, 'Leitrim' => 54.15958998847932, 'Limerick' => 52.5073717679716, 'Longford' => 53.72560657186752, 'Louth' => 53.8909278260148, 'Mayo' => 53.90772313917313, 'Meath' => 53.64474627355919, 'Monaghan' => 54.13554372516339, 'Offaly' => 53.24538065369401, 'Roscommon' => 53.7846343658489, 'Sligo' => 54.13888636777899, 'Tipperary' => 52.62250956397233, 'Waterford' => 52.13377132397969, 'Westmeath' => 53.52629333311288, 'Wexford' => 52.41549733389294, 'Wicklow' => 52.9869284997658);

	return $countyCentreLat[$county];
}

function loadData() {
	$dbh = setupDB();
	$result = $dbh->query("SELECT * FROM transactions ORDER BY county ASC, date DESC");

	$json = array("counties" => "");
	$json['counties'] = array();

	$row = $result->fetch(PDO::FETCH_ASSOC);
	while ($row){

		$countyName = $row['county'];
		$county = array('name' => $countyName, 'lat' => getCountyLat($countyName), 'lng' => getCountyLng($countyName));

		$countyTransactions = array();
		
		while ($row['county'] == $countyName) {
			
			$year = substr($row['date'], 0, 4);
			$transactionsByYear = array();

			while (substr($row['date'], 0, 4) == $year) {
				$transaction = array('address' => $row['address'], 'date' => $row['date'], 'price' => $row['price'], 'notMarket' => $row['not_full_market_price'], 'lat' => $row['lat'], 'lng' => $row['lng']);				
				array_push($transactionsByYear,$transaction);
				$row = $result->fetch(PDO::FETCH_ASSOC);
			}
			$countyTransactionsByYear = array(); 
			$countyTransactionsByYear['year'] = $year;
			$countyTransactionsByYear['sales'] = $transactionsByYear;

			array_push($countyTransactions, $countyTransactionsByYear);
		}
		$county['transactions'] = $countyTransactions;

		array_push($json['counties'],$county);
	}

	print json_encode($json);
}

function loadResales() {
	$dbh = setupDB();
	$result = $dbh->query("SELECT t1.date AS date1, t2.date AS date2, t1.county AS county, t1.price AS price1, t2.price AS price2, t1.address AS address, t1.not_full_market_price AS not_full_market_price, t1.lat AS lat, t1.lng AS lng FROM transactions AS t1 LEFT JOIN transactions AS t2 ON t1.address = t2.address WHERE t1.county = t2.county AND t1.date != t2.date AND t1.price != t2.price GROUP BY address ORDER BY county ASC, date1 DESC, date2 DESC");

	$json = array("counties" => "");
	$json['counties'] = array();

	$row = $result->fetch(PDO::FETCH_ASSOC);
	while ($row){

		$countyName = $row['county'];
		$county = array('name' => $countyName, 'lat' => getCountyLat($countyName), 'lng' => getCountyLng($countyName));

		$countyTransactions = array();
		
		while ($row['county'] == $countyName) {
			$transaction = array('address' => $row['address'], 'date1' => $row['date1'], 'date2' => $row['date2'], 'price1' => $row['price1'], 'price2' => $row['price2'], 'lat' => $row['lat'], 'lng' => $row['lng']);				
			array_push($countyTransactions,$transaction);
			$row = $result->fetch(PDO::FETCH_ASSOC);
		}
		$county['transactions'] = $countyTransactions;
		array_push($json['counties'],$county);
	}
	print json_encode($json);
}


?>