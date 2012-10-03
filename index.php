<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Property Price List</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width">

  <link rel="stylesheet" href="css/bootstrap.min.css">
  <style>
  body {
    padding-top: 60px;
    padding-bottom: 40px;
  }
  </style>
  <link rel="stylesheet" href="css/bootstrap-responsive.min.css">
  <link rel="stylesheet" href="css/main.css">

  <script src="js/vendor/modernizr-2.6.1-respond-1.1.0.min.js"></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=visualization&key=AIzaSyDHIaLS6tpFvPYXssTyb8yO19Q0b-i6cb8&sensor=false&region=IE"></script>
  
  <script type="text/javascript">
    var data = 
    <?php
      include 'db/countyCount.php';
      loadData();
    ?>
    ;
    var resales = 
    <?php
    loadResales();
    ?>
    ;
  </script>
</head>
<body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
            <![endif]-->

            <!-- This code is taken from http://twitter.github.com/bootstrap/examples/hero.html -->

            <div class="navbar navbar-inverse navbar-fixed-top">
              <div class="navbar-inner">
                <div class="container">
                  <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </a>
                  <a class="brand" href="#">Irish Property Price Map</a>
                  <div class="nav-collapse collapse">
                    <ul class="nav">
                      <li class="active"><a href="#home">Home</a></li>
                      <li><a href="#about">About</a></li>
                      <li><a href="#contact">Contact</a></li>
                    </ul>
                  </div><!--/.nav-collapse -->
                </div>
              </div>
            </div>

            <div class="container">
              <!-- Example row of columns -->
              <div class="row">
                <div class="span12">
                  <a name="home"></a>
                  <div id="map"></div>
                </div>
              </div>

              <div class="row">
                <div class="span2">
                  <p><span class="blueDot"></span> 2012</p>
                </div>
                <div class="span2">  
                  <p><span class="greenDot"></span> 2011</p>
                </div>
                <div class="span2">  
                  <p><span class="redDot"></span> 2010</p>
                </div>
                <div class="span2">  
                  <p><img class="multipleMarkers" src="img/m3.png" title="Cluster Marker"/> Multiple sales</p>
                </div>
                <div class="span4">  
                  <p>Transactions loaded: <span class="totalTransactionsShown"></span></p>
                </div>
              </div>

              <div class="row">
                <div class="span2">
                  <p>Show all resales of properties from 2010-2012</p>
                </div>
                <div class="span3">
                  <button type="button" class="btn resales">Show All Resales</button>
                </div>
                <div class="span5">
                </div>
              </div>

              <div class="row">
                <div class="span2">
                  <p>Select a year to show transactions</p>
                </div>
                <div class="span4">
                  <div class="btn-group transaction-years" data-toggle="buttons-radio">
                    <button type="button" class="btn all active">All</button>
                    <button type="button" class="btn y2012">2012</button>
                    <button type="button" class="btn y2011">2011</button>
                    <button type="button" class="btn y2010">2010</button>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="span2">
                  <p>Select a value to show transactions</p>
                </div>
                <div class="span9">
                  <div class="btn-group transaction-value" data-toggle="buttons-radio">
                    <button type="button" class="btn all active">All</button>
                    <button type="button" class="btn o1million">Over €1m</button>
                    <button type="button" class="btn o750000">€750k - €1m</button>
                    <button type="button" class="btn o500000">€500k - €750k</button>
                    <button type="button" class="btn o250000">€250k - €500k</button>
                    <button type="button" class="btn o150000">€150k - €250k</button>
                    <button type="button" class="btn o100000">€100k - €150k</button>
                    <button type="button" class="btn o0">Below €100k</button>
                  </div>
                </div>
              </div>
              <hr>

              <div class="row">
                <div class="span12">
                  <a name="about"></a>
                  <h2>About</h2>
                  <p>This site utilises the <a href="http://www.propertypriceregister.ie/">Property Register of Ireland</a> dataset to build a map showing the sales of property in Ireland starting in January 2010 and up to mid-August 2012. The number of transactions is ~52,000, but a little under 2,000 addresses failed to geocode and aren't shown.</p>
                  <p><strong>Disclaimer:</strong> All addresses have been automatically geoCoded using either the <a href="http://www.mapquest.com/">MapQuest</a> Open Geocoding Service that utlises <a href="http://www.openstreetmap.org/">Open Street Map</a> information, or addresses have been geocoded with the <a href="http://yahoo.com">Yahoo Geocoding Service</a>. Errors are a certainty, this site is for information purposes only. Clicking a marker brings up the info on the sale, the address is a link that will geoCode the address with Google Maps, that will often give a better result than shown on this map.</p>
                  <p>To find specific properties, try <a href="http://karlmonaghan.com/property/">Karl Monaghan's mapping of the property price register</a>.</p>
                  <p>Hosted by <a href="http://kdeg.cs.tcd.ie">Knowledge and Data Engineering Group</a> in <a href="http://www.tcd.ie">Trinity College Dublin</a>
                  </div>
                </div>

                <hr>

                <div class="row">
                  <div class="span12">
                    <a name="contact"></a>
                    <h2>Contact</h2>
                    <p><a href="mailto:eoin.bailey@scss.tcd.ie">eoin.bailey@scss.tcd.ie</a></p>
                  </div>
                </div>

                <hr>

                <footer>
                  <p>&copy; 2012</p>
                </footer>

              </div> <!-- /container -->

              <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
              <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.1.min.js"><\/script>')</script>

              <script src="js/vendor/bootstrap.min.js"></script>

              <script src="js/markerclusterer_compiled.js"></script>
              <script src="js/main.js"></script>

               <script>
              var _gaq=[['_setAccount','UA-35254873-1'],['_trackPageview']];
              (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
                s.parentNode.insertBefore(g,s)}(document,'script'));
               </script>
            </body>
            </html>
