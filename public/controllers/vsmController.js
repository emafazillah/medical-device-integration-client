var vsmApp = angular.module('vsmApp', []);
vsmApp.controller('VsmAppCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Hello World from vsmController");
	
	var refresh = function() {
		$http.get('/vsmlist').then(function(response) {
			console.log("I GET request data");
			$scope.vsmlist = response.data;
		});
	};
	
	refresh();
	
	$scope.add = function() {
		console.log($scope.vsm);
		
		$http.post('/vsmlist', $scope.vsm).then(function(response) {
			console.log(response);
			refresh();
		});
	};
	
	$scope.remove = function(id) {
		console.log(id);
		
		$http.delete('/vsmlist/' + id).then(function(response) {
			refresh();
		});
	};
	
	$scope.edit = function(id) {
		console.log(id);
		
		$http.get('/vsmlist/' + id).then(function(response) {
			$scope.vsm = response.data;
		});
	};
	
	$scope.update = function() {
		console.log($scope.vsm._id);
		
		$http.put('/vsmlist/' + $scope.vsm._id, $scope.vsm).then(function(response) {
			refresh();
		});
	};
	
	$scope.clear = function() {
		$scope.vsm = null;
	};
	
	// DEVICE http://127.0.0.1:9233/WelchAllyn/Device/GetDevices
	$scope.device = function() {
		$http.get('http://127.0.0.1:9233/WelchAllyn/Device/GetCurrentReading?deviceid=USB_00000006').then(function(response) {
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
	
}])
