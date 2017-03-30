var patientVsmApp = angular.module('patientVsmApp', []);
patientVsmApp.controller('PatientVsmAppCtrl', ['$scope', '$http', function($scope, $http) {
	
	console.log("Hello World from patientVsmController");
	
	var refresh = function() {
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms').then(function(response){
			console.log("I GET from RESTful API");		
			var tblpatientvsm = response.data;
			$scope.tblpatientvsm = tblpatientvsm;
		});		
	};
	
	refresh();
	
	$scope.add = function() {
		console.log($scope.patient);
		
		$http.post('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms', $scope.patient).then(function(response) {
			console.log(response);
			refresh();
		});
	};
	
	$scope.remove = function(id) {
		console.log(id);
		
		$http.delete('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/' + id).then(function(response) {
			refresh();
		});
	};
	
	$scope.edit = function(id) {
		console.log(id);
		
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/' + id).then(function(response) {
			$scope.patient = response.data;
		});
	};
	
	$scope.update = function() {
		console.log($scope.patient.id);
		
		$http.put('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/' + $scope.patient.id, $scope.patient).then(function(response) {
			refresh();
		});
	};
	
	$scope.clear = function() {
		$scope.patient = null;
	};
	
	// DEVICE http://127.0.0.1:9233/WelchAllyn/Device/GetDevices
	$scope.device = function() {
		$http.get('http://127.0.0.1:9233/WelchAllyn/Device/GetCurrentReading?deviceid=USB_00000004').then(function(response) {
			console.log("I GET request data from DEVICE");
			
			var deviceArray = response.data;			
			$scope.vsm = {
					bmi: deviceArray[0].bmi,
					clinicianid: deviceArray[0].clinicianid,
					date: deviceArray[0].date,
					diastolic: deviceArray[0].diastolic,
					height: deviceArray[0].height,
					hr: deviceArray[0].hr,
					map: deviceArray[0].map,
					o2sat: deviceArray[0].o2sat,
					pain: deviceArray[0].pain,
					patientid: deviceArray[0].patientid,
					pulse: deviceArray[0].pulse,
					respiration: deviceArray[0].respiration,
					systolic: deviceArray[0].systolic,
					temperature: deviceArray[0].temperature,
					weight: deviceArray[0].weight
			};
		});
	};
			
}]);
