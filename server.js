var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('vsmlist', ['vsmlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

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

app.listen(3000);
console.log("Server is running on port 3000");
