require 'net/http'
require 'json'
require 'csv'
require 'mysql2'

# LogFile
# log = File.open "propertyPriceGeoCoded.csv", "a"
failLog = File.open "propertyPriceNoGeoCode.csv", "w+"

def yahooGeoCode(address) 

	#  YAHOO
	# http://developer.yahoo.com/geo/placefinder/guide/requests.html#flags-parameter
	apiYahoo = 'http://where.yahooapis.com/geocode?appid=<YAHOO API KEY>&country=IE&flags=CJ&count=1&q='

	begin
	  data = Net::HTTP.get_response(URI.parse(apiYahoo+address)).body
	  json = JSON.parse(data)

	  if json['ResultSet']['ErrorMessage'] == "No error"
	  	coords = Array.new
		  coords.push json['ResultSet']['Result']['latitude']
		  coords.push json['ResultSet']['Result']['longitude']
	  	return coords
		else 
			return false
	  end
	rescue
	   print apiYahoo+address + " --- Connection error for Yahoo geocoder.\n"
	   return false
	end
end

def mapQuestGeoCode(address)

	# MapQuest
	# http://open.mapquestapi.com/nominatim/
	apiMapQuest = 'http://open.mapquestapi.com/nominatim/v1/search?format=json&limit=1&countrycodes=IE&q=' 

	begin
		data = Net::HTTP.get_response(URI.parse(apiMapQuest+address)).body
		
		if (data.size > 2)
			
		  json = JSON.parse(data[1..-2])
		  
		  coords = Array.new
		  coords.push json['lat']
		  coords.push json['lon']
		  return coords
		else
			return false
		end
	rescue
		print apiMapQuest+address+" --- error in map quest geocoding\n"
		return false
	end
end

client = Mysql2::Client.new(:host => "127.0.0.1", :username => "root" , :password => "password")
client.query("USE propertyPriceList;")

line = 0

CSV.foreach("propertyPriceList.csv", :quote_char => '"', :col_sep =>',', :row_sep =>:auto) do |row|
	if (row[0].nil?)
		print "No date found, skip this line -- "+ line.to_s
	else
		# convert DATE -- dd/mm/yyyy -> 'YYYY-MM-DD'
		# TODO: UPDATE DATE FIELD!!!! ARGH! IT IS ACTUALLY mm/dd/yyyy
		date = row[0].split('/')
		year = date[2]
		month = date[0]
		day = date[1]

		if month.size == 1
			month = "0"+month
		end
		if day.size == 1
			day = "0" + day
		end

		date = year.to_s+"-"+month.to_s+"-"+day.to_s

		# I'm not sure what this is for...
		notFullMarketPrice = "TRUE"
		if (row[5].to_s == 'no')
			notFullMarketPrice = "FALSE"
		end

		results = client.query('SELECT id, lat, lng FROM transactions WHERE address = "'+row[1].to_s+'" AND county = "'+row[3].to_s+'";')

		# THIS WAS FOR UPDATING THE DATE I ENTERED INCORRECTLY IN THE DATABASE FIRST TIME AROUND
		# results = client.query('SELECT id FROM transactions WHERE address = "'+row[1]+'";')		
		# if results.count == 1
		# 	client.query('UPDATE transactions SET date = "'+date+'" WHERE address ="'+row[1]+'";')
		# end
		
		if results.count == 0
			# There is no match for the address in the database, try to geocode this address

			address = row[1].gsub(/ /, "+") + "+"+row[3]
			success = mapQuestGeoCode(address)
			if (!success)
				success = yahooGeoCode(address)
			end
			
			if (!success)
				failLog << row[0].to_s+",\""+row[1].to_s+"\","+row[2].to_s+","+row[3].to_s+","+row[4].to_s+","+row[5].to_s+",\""+address+"\" \n"
				print "Geocoding failed\n"
			else
				# print 'INSERT INTO transactions (date, address, county, postal_code, price, not_full_market_price, lat, lng) VALUES ("'+date.to_s+'", "'+row[1].to_s+'", "'+row[3].to_s+'", "'+row[2].to_s+'", '+row[4].to_s+', '+notFullMarketPrice.to_s+', '+success[0].to_s+', '+success[1].to_s+');'
				client.query('INSERT INTO transactions (date, address, county, postal_code, price, not_full_market_price, lat, lng) VALUES ("'+date.to_s+'", "'+row[1].to_s+'", "'+row[3].to_s+'", "'+row[2].to_s+'", '+row[4].to_s+', '+notFullMarketPrice.to_s+', '+success[0].to_s+', '+success[1].to_s+');')
			end
			# sleep 0.2
		elsif results.count >= 1
			# There is a lat/lng pair in the DB for this address already, use this lat/lng instead of geocoding
			# check if this is the same date, if so, we're updating/or doing nothing, if not we're adding a new transaction for the same address
			
			identicalResult = client.query('SELECT id FROM transactions WHERE address = "'+row[1].to_s+'" AND county = "'+row[3].to_s+'" AND date = "'+date.to_s+'";')
			if identicalResult.count == 0
				# There's a match for the lat lng, but it's a different date
				lat = 0.0
				lng = 0.0
				results.each do | matchingResult |
					lat = matchingResult['lat']
					lng = matchingResult['lng']
				end
				client.query('INSERT INTO transactions (date, address, county, postal_code, price, not_full_market_price, lat, lng) VALUES ("'+date.to_s+'", "'+row[1].to_s+'", "'+row[3].to_s+'", "'+row[2].to_s+'", '+row[4].to_s+', '+notFullMarketPrice.to_s+', '+lat.to_s+', '+lng.to_s+');')
				print "Adding transaction for same property, different date\n"
			else
				# This entry is already in the database, this is where updates can go if things get updated
				# id = identicalResult.row['id'] # Get the id from the result
				# client.query('UPATE transactions SET   WHERE id = ')
			end
		else 
			print "Something has gone wrong...\n"
		end
	end
	line = line + 1
end