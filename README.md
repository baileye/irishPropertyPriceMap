# Map of Irish Property Transactions

Maps the [Irish Property Price Register](http://www.propertypriceregister.ie/) data as released at the end of September 2012. 

## GeoCodes

GeoCodes were completed with [MapQuests](http://www.mapquest.com) Open GeoCode API utilising Nominatim from [Open Street Map](http://www.openstreetmap.org), or [Yahoo](http://yahoo.com)'s GeoCoder service. The GeoCode script is included, along with a data dump from the database with all the geoCoded transactions. Also included is a file that lists all address that failed to geoCode, ~2,000 of them. There are definitely errors in the GeoCodes, some are outside Ireland for example, and I'm sure some in Ireland are just plain wrong, while others are region level matches which isn't exceedingly useful. I'm working on getting improved geoCode locations.

## Live Site

Visit the live site: [http://kdeg.cs.tcd.ie/propertyPriceMap/](http://kdeg.cs.tcd.ie/propertyPriceMap/) 

## Thanks 

Site hosted by [Knowledge and Data Engineering Group](http://kdeg.cs.tcd.ie), in [Trinity College Dublin](http://www.tcd.ie)