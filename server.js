var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('vsmlist', ['vsmlist']);
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request-promise');
var nconfig = require('./lib/configuration/app');

var gulp = require('gulp'); // Load gulp
require('./gulpfile'); // Loads our ng-config task
gulp.start('ng-config'); // Kick of gulp 'ng-config' task, which generates angular const configuration

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

var welchAllynOptions = {
	host: nconfig.get('welchallynoptions:host'),
	port: nconfig.get('welchallynoptions:port'),
	path: nconfig.get('welchallynoptions:path'),
	method: nconfig.get('welchallynoptions:method')
};

/* Cron to run set by config file */
function cron() {
	
	/* Start Process */
	getDevice(welchAllynOptions, function(err, result){
		if(err || result === null || result === undefined){
			return console.log('Error while trying to get device', err);
		} else {
			console.log(result[0].deviceid);
			
			// post device data
			/*
			var apiDeviceOptions = {
					method: nconfig.get('apideviceoptions:method'),
					uri: nconfig.get('apideviceoptions:uri'),
					body: JSON.stringify(result[0]),
					headers: { 'Content-Type': 'application/json' }
			};
			request(apiDeviceOptions).then(function(response){
				console.log('POST Device response', response);
			}).catch(function(err){
				console.log('ERROR POST Device response', err);
			});
			*/
			
			// get patient data
			var currentReading = '/WelchAllyn/Device/GetCurrentReading?deviceid=' + result[0].deviceid;
			var currentReadingOptions = {
					host: nconfig.get('welchallynoptions:host'),
					port: nconfig.get('welchallynoptions:port'),
					path: currentReading,
					method: nconfig.get('welchallynoptions:method')
			};
			getDevice(currentReadingOptions, function(err, currentReadingOptionsResult){
				if(err || currentReadingOptionsResult === null || currentReadingOptionsResult === undefined){
					return console.log('Error while trying to get current reading', err);
				} else {
					console.log(currentReadingOptionsResult[0].date);
					
					// post current reading
					var reconstruct = currentReadingOptionsResult[0];
					var apiCurrentReading = {
							method: nconfig.get('apicurrentreading:method'),
							uri: nconfig.get('apicurrentreading:uri'),
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
	    	
	setTimeout(cron, nconfig.get('cron:timeout'));
    
}

cron();
/* Get Data */

app.listen(nconfig.get('app:port'));

console.log("Server is running on port " + nconfig.get('app:port'));
