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
	
    setTimeout(five, 5000);
    
}

five();
/* Get Data */

/* vsm.html */
// GET list
app.get('/vsmlist', function(req, res) {
	console.log("I GET response data");
	
	db.vsmlist.find(function(err, docs) {
		console.log(docs);
		res.json(docs);
	});
});

// POST
app.post('/vsmlist', function(req, res) {
	console.log(req.body);
	
	db.vsmlist.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

// DELETE
app.delete('/vsmlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	
	db.vsmlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

// GET by ID
app.get('/vsmlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	
	db.vsmlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

// PUT
app.put('/vsmlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(req.body.name);
	
	db.vsmlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {
			bmi: req.body.bmi,
			clinicianid: "4321",
			date: req.body.date,
			diastolic: req.body.diastolic,
			height: req.body.height,
			hr: req.body.hr,
			map: req.body.map,
			o2sat: req.body.o2sat,
			pain: req.body.pain,
			patientid: "1234567",
			pulse: req.body.pulse,
			respiration: req.body.respiration,
			systolic: req.body.systolic,
			temperature: req.body.temperature,
			weight: req.body.weight
		}},
		new: true}, function(err, doc) {
		res.json(doc);
	});
});
/* vsm.html */

app.listen(3000);
console.log("Server is running on port 3000");
