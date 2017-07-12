// comment first because error when parsing variable from config.js
// require('./config.js');
// and hard code as below;
var ENV_VARS = "http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatienthiskkms";

var indexApp = angular.module('indexApp', []);
indexApp.controller('IndexCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Hello from indexController");
	
	$scope.url = ENV_VARS;
	var refresh = function() {
		$http.get($scope.url + '/listpatientid/95746').then(function(response){
			console.log("I GET from RESTful API");		
			var vsms = response.data;
			$scope.vsms = vsms;
		});		
	};
	
	refresh();
	
	$scope.add = function() {
		console.log($scope.vsm);
		
		$http.post($scope.url, $scope.vsm).then(function(response) {
			console.log(response);
			refresh();
		});
	};
	
	$scope.remove = function(id) {
		console.log(id);
		
		$http.delete($scope.url + id).then(function(response) {
			refresh();
		});
	};
	
	$scope.edit = function(id) {
		console.log(id);
		
		$http.get($scope.url + id).then(function(response) {
			$scope.vsm = response.data;
		});
	};
	
	$scope.update = function() {
		console.log($scope.vsm.id);
		
		$http.put($scope.url + $scope.vsm.id, $scope.vsm).then(function(response) {
			refresh();
		});
	};
	
	$scope.clear = function() {
		$scope.vsm = null;
	};
	
	// DEVICE list -> http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746
	// DEVICE latest reading -> http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/patientid/95746
	$scope.device = function() {
		$http.get($scope.url + '/patientid/95746').then(function(response) {
			console.log("I GET request data from DEVICE");
			
			var deviceArray = response.data;			
			$scope.vsm = {
					bmi: deviceArray.bmi,
					clinicianid: deviceArray.clinicianid,
					date: deviceArray.date,
					diastolic: deviceArray.diastolic,
					height: deviceArray.height,
					hr: deviceArray.hr,
					map: deviceArray.map,
					o2sat: deviceArray.o2sat,
					pain: deviceArray.pain,
					patientid: deviceArray.patientid,
					pulse: deviceArray.pulse,
					respiration: deviceArray.respiration,
					systolic: deviceArray.systolic,
					temperature: deviceArray.temperature,
					weight: deviceArray.weight
			};
		});
	};
	
}]);