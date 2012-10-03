
var map; // map variable

var markersArray = [];
var markerCluster; // http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.0.14/docs/reference.html
var mcOptions = {gridSize: 40, zoomOnClick: false};

var infoWindow = new google.maps.InfoWindow(); // the infowindow that appears on the map

var heatmap;
var heatMapData = [];
var heatMapDataWeight = [];

var showAll = 1;
var show2012 = 0;
var show2011 = 0;
var show2010 = 0;

var colour2012 = "#0000FF";
var colour2011 = "#00FF00";
var colour2010 = "#FF0000";

var showAllValues = 1;
var showOverMillion = 0;
var showOver750k = 0;
var showOver500k = 0;
var showOver250k = 0;
var showOver150k = 0;
var showOver100k = 0;
var showOver0 = 0;

// jQuery function
$(document).ready(function() {
  initializeMap();
  // the markerCluster object has to be initialised before this is set up
  setupButtonHandlers();

});

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


function setupButtonHandlers() {
  $(".transaction-years").button();
  $(".transaction-value").button();

  $(".btn.resales").click(function() {
    $(".transaction-years .btn").removeClass("active");
    $(".transaction-value .btn").removeClass("active");
    $(this).addClass('active');
    show2012 = 0;
    show2011 = 0;
    show2010 = 0;
    showAll = 1;
    showAllValues = 1;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    // $(".transaction-years .all").addClass('active');
    // $(".transaction-value .all").addClass("active");
    resetClusters();
    showResales();
  });

  $(".transaction-years .all").click(function() {
    $(".btn.resales").removeClass('active');
    show2012 = 0;
    show2011 = 0;
    show2010 = 0;
    showAll = 1;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-years .y2012").click(function() {
    $(".btn.resales").removeClass('active');
    show2012 = 1;
    show2011 = 0;
    show2010 = 0;
    showAll = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-years .y2011").click(function() {
    $(".btn.resales").removeClass('active');
    show2012 = 0;
    show2011 = 1;
    show2010 = 0;
    showAll = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-years .y2010").click(function() {
    $(".btn.resales").removeClass('active');
    show2012 = 0;
    show2011 = 0;
    show2010 = 1;
    showAll = 0;
    resetClusters();
    markerClusterer();
  });


  $(".transaction-value .all").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 1;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o1million").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 1;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o750000").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 1;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o500000").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 1;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o250000").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 1;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o150000").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 1;
    showOver100k = 0;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o100000").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 1;
    showOver0 = 0;
    resetClusters();
    markerClusterer();
  });
  $(".transaction-value .o0").click(function() {
    $(".btn.resales").removeClass('active');
    showAllValues = 0;
    showOverMillion = 0;
    showOver750k = 0;
    showOver500k = 0;
    showOver250k = 0;
    showOver150k = 0;
    showOver100k = 0;
    showOver0 = 1;
    resetClusters();
    markerClusterer();
  });
}

function resetClusters() {
  markersArray = [];
  heatMapData = [];
  heatMapDataWeight = [];
  markerCluster.clearMarkers();
}

// Set up the Map
function initializeMap() {
	var mapOptions = {
  	zoom: 7,
  	center: new google.maps.LatLng(53.4656,-7.7691),
  	mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, "OSM", google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID]
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    minZoom: 7,
    maxZoom: 17,
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);	

  map.mapTypes.set("OSM", new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
          return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
      },
      tileSize: new google.maps.Size(256, 256),
      name: "Open Street Map",
      maxZoom: 18
  }));

  markerClusterer();
}

function showTotalTransactionsCount() {
  var count = markersArray.length;
  $(".totalTransactionsShown").html(count);
}

// function heatMapLayer(weight) {
//   var heatmapData = [];
//   if (weight) {
//     heatmapData = heatMapDataWeight;
//   } else {
//     heatmapData = heatMapData;
//   }
//   heatmap = new google.maps.visualization.HeatmapLayer({
//     data: heatmapData
//   });
  
//   heatmap.setMap(map);
// }

function markerClusterer() {

  $.each(data.counties, function(i, county) {
    $.each(county.transactions, function(j, list) {
      var listYear = parseInt(list.year);

      // CHECK FOR YEAR OPTION BEING SET
      if ( (showAll == 1) || ( (show2012 == 1) && (listYear == 2012) ) || ( (show2011 == 1) && (listYear == 2011) ) || ( (show2010 == 1) && (listYear == 2010) ) ) {
        
        var color = colour2012;
        if (listYear == 2011) {
          color = colour2011;
        } 
        if (listYear == 2010) {
          color = colour2010;
        }
        var transactionIcon = {
          fillColor: color,
          fillOpacity: 0.5,
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 1,
        };

        $.each(list.sales, function(j, sale) {
          var salePrice = parseInt(sale.price);
          // CHECK FOR VALUE OPTION BEING SET
          if ( (showAllValues == 1) || ( (showOverMillion == 1) && (salePrice >= 1000000 ) ) || ( (showOver750k == 1) && (salePrice < 1000000 ) && (salePrice >= 750000 ) ) || ( (showOver500k == 1) && (salePrice < 750000 ) && (salePrice >= 500000 ) ) || ( (showOver250k == 1) && (salePrice < 500000 ) && (salePrice >= 250000 ) ) || ( (showOver150k == 1) && (salePrice < 250000 ) && (salePrice >= 150000 ) ) || ( (showOver100k == 1) && (salePrice >= 100000 ) && (salePrice < 150000 ) ) || ( (showOver0 == 1) && (salePrice < 100000 ) ) ) {
            var polyCenter = new google.maps.LatLng(parseFloat(sale.lat), parseFloat(sale.lng));
            
            // heatMapData.push(polyCenter);
            // var weightedLocation = {};
            // weightedLocation.location = polyCenter;
            // weightedLocation.weight = parseInt(sale.price);
            // heatMapDataWeight.push(weightedLocation);

            var title = sale.address+", "+county.name+" \n€"+sale.price;
          
            var transactionObject = new google.maps.Marker({
                position: polyCenter,
                flat: true,
                title: title,
                icon: transactionIcon,
            });
            
            transactionObject.address = sale.address;
            transactionObject.price = sale.price;
            transactionObject.county = county.name;
            transactionObject.date = sale.date;
            transactionObject.notMarket = sale.notMarket;
            transactionObject.year = list.year;

            markersArray.push(transactionObject);
            google.maps.event.addListener(transactionObject, 'click', function() {
              infoWindow.setContent(getTransactionMarkerInfo(transactionObject));
              infoWindow.setPosition(transactionObject.position);
              infoWindow.setMap(map);
            });
          }
        });
      }
    });
  });

  markerCluster = new MarkerClusterer(map, markersArray, mcOptions);

  google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
    clusterClicked(cluster);
  });

  showTotalTransactionsCount();
}

function showResales() {
  var transactionIcon = {
    fillColor: '#FF0000',
    fillOpacity: 0.5,
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
  };


  $.each(resales.counties, function(i, county) {
    $.each(county.transactions, function(j, sale) {
      var polyCenter = new google.maps.LatLng(parseFloat(sale.lat), parseFloat(sale.lng));      

      var title = sale.address+", "+county.name+" \n€"+sale.price;
          
      var transactionObject = new google.maps.Marker({
          position: polyCenter,
          flat: true,
          title: title,
          icon: transactionIcon,
      });
      
      transactionObject.address = sale.address;
      transactionObject.price1 = sale.price1;
      transactionObject.price2 = sale.price2;
      transactionObject.county = county.name;
      transactionObject.date1 = sale.date1;
      transactionObject.date2 = sale.date2;

      markersArray.push(transactionObject);
      google.maps.event.addListener(transactionObject, 'click', function() {
        infoWindow.setContent(getResaleInfo(transactionObject));
        infoWindow.setPosition(transactionObject.position);
        infoWindow.setMap(map);
      });
    });
  });

  markerCluster = new MarkerClusterer(map, markersArray, mcOptions);

  google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
    clusterClickedResale(cluster);
  });

  showTotalTransactionsCount()
}

function clusterClickedResale(cluster) {
  var markers = cluster.getMarkers();
  var content = '<div id="infoWindow"><ul>';
  $.each(markers, function(i, marker) {
    content += "<li>"+getResaleInfo(marker)+"</li>";
  });
  content += "</ul></div>";
  infoWindow.setContent(content);
  infoWindow.setPosition(cluster.getCenter());
  infoWindow.setMap(map); 
}

function getResaleInfo(transaction) {
  var date1 = transaction.date1;
  var date2 = transaction.date2;
  var price1 = transaction.price1;
  var price2 = transaction.price2;
  
  if (transaction.date1 > transaction.date2) {
    date1 = transaction.date2;
    date2 = transaction.date1;
    price1 = transaction.price2;
    price2 = transaction.price1;
  }
  var difference = price2 - price1;
  var negative = "";
  if (difference < 0) {
    negative = "-";
    difference = difference * -1;
  }

  
  var daysBetweenTransactions = daydiff(parseDate(date1), parseDate(date2)) + 1;
  if (daysBetweenTransactions < 0) {
    daysBetweenTransactions = daysBetweenTransactions * -1;
  }

  var content =  "<a href=\"http://maps.google.com/maps?q="+transaction.address+","+transaction.county+",Ireland\">"+transaction.address+", "+transaction.county+"</a><br>";
  content += "<em>"+date1+"</em>: sold for €"+price1+"<br><em>"+date2+"</em>: sold for €"+price2+"<br><em>Difference</em>: "+negative+"€"+difference;
  content += "<br>Days between transactions: "+daysBetweenTransactions;
  return content;
}
function parseDate(str) {
  var mdy = str.split('-')
  return new Date(mdy[0], mdy[1]-1, mdy[0]);
}

function daydiff(first, second) {
  return Math.round((second-first)/(1000*60*60*24));
}



function clusterClicked(cluster) {
  // HANDLE THE CLICK ON A CLUSTER
  // console.log(cluster.getSize());
  var markers = cluster.getMarkers();
  var content = '<div id="infoWindow"><ul>';
  $.each(markers, function(i, marker) {
    content += "<li>"+getTransactionMarkerInfo(marker)+"</li>";
  });
  content += "</ul></div>";
  infoWindow.setContent(content);
  infoWindow.setPosition(cluster.getCenter());
  infoWindow.setMap(map);
}

function getTransactionMarkerInfo(marker) {
  var content = "<em>"+marker.date+"</em>: <a href=\"http://maps.google.com/maps?q="+marker.address+","+marker.county+",Ireland\">"+marker.address+", "+marker.county+"</a>, €"+marker.price
  return content;
}



// function drawCountyMarkers() {
//   $.each(data.counties, function(i, county) {
//     var transactionIcon = {
//       fillColor: '#0000FF',
//       fillOpacity: 0.35,
//       path: google.maps.SymbolPath.CIRCLE,
//       scale: 10,
//       strokeColor: '#0000FF',
//       strokeOpacity: 0.8,
//       strokeWeight: 1,
//     };
//     var polyCenter = new google.maps.LatLng(county.lat, county.lng);
    
//     var title = county.name+" - ";
//     $.each(county.transactions, function(j, dataSet) {
//       title += "\n"+dataSet.year+": "+dataSet.sales.length+" transactions";
//     });

//     var transactionObject = new google.maps.Marker({
//         position: polyCenter,
//         flat: true,
//         title: title,
//         icon: transactionIcon,
//     });
    
//     // add the infowindow for this polygon
//     // addInfoWindow(markerObject, townlandMapObject, polyCenter);
//     markersArray.push(transactionObject);
//     transactionObject.setMap(map);
//   });
// }

// function updateTransactions() {
//   if (map.getZoom() >= 10) {
//     clearOverlays();
//     console.log("Drawing individual markers");
//     $.each(data.counties, function(i, county) {

//     });
//   }
// }

// function clearOverlays() {
//   for (var i = 0; i < markersArray.length; i++ ) {
//     markersArray[i].setMap(null);
//   }
// }