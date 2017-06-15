/* testing pr */
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('vsmlist', ['vsmlist']);
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request-promise');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

/* Get Data */
function getDevice(options, callback){
	http.request(options, function(response){		
		var body = '';		
		response.on('data', function(chunk){
			body+=chunk;
		});		
		response.on('end', function(){	
			var result = JSON.parse(body);
			callback(null, result);
		});		
		response.on('error', callback);		
	})
	.on('error', callback)
	.end();
}

var options = {
		host: '127.0.0.1',
		port: 9233,
		path: '/WelchAllyn/Device/GetDevices',
		method: 'GET'
};

/* Run every 5 seconds */
function five() {
	
	/* Start Process */
	getDevice(options, function(err, result){
		if(err || result === null || result === undefined){
			return console.log('Error while trying to get device', err);
		} else {
			console.log(result[0].deviceid);
			
			// post device data
			var apiDeviceOptions = {
					method: 'POST',
					uri: 'http://mywildflyrestv2-emafazillah.rhcloud.com/api/tbldevices',
					body: JSON.stringify(result[0]),
					headers: { 'Content-Type': 'application/json' }
			};
			request(apiDeviceOptions).then(function(response){
				console.log('POST Device response', response);
			}).catch(function(err){
				console.log('ERROR POST Device response', err);
			});
			
			// get patient data
			var currentReading = '/WelchAllyn/Device/GetCurrentReading?deviceid=' + result[0].deviceid;
			var currentReadingOptions = {
					host: '127.0.0.1',
					port: 9233,
					path: currentReading,
					method: 'GET'
			};
			getDevice(currentReadingOptions, function(err, currentReadingOptionsResult){
				if(err || currentReadingOptionsResult === null || currentReadingOptionsResult === undefined){
					return console.log('Error while trying to get current reading', err);
				} else {
					console.log(currentReadingOptionsResult[0].date);
					
					// post current reading
					var reconstruct = currentReadingOptionsResult[0];
					var apiCurrentReading = {
							method: 'POST',
							uri: 'http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms',
							body: JSON.stringify(reconstruct),
							headers: { 'Content-Type': 'application/json' }
					};
					request(apiCurrentReading).then(function(response){
						console.log('POST Current Reading response', response);
					}).catch(function(err){
						console.log('ERROR POST Current Reading response', err);
					});
				}
			});
		}
	});
	
    // PROD setTimeout(five, 5000);
	setTimeout(five, 10000); // DEV
    
}

five();
/* Get Data */

app.listen(3000);
console.log("Server is running on port 3000");
