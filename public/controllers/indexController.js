var indexApp = angular.module('indexApp', []);
indexApp.controller('IndexCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Hello from indexController");
	
	var refresh = function() {
		$http.get('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746').then(function(response){
			console.log("I GET from RESTful API");		
			var vsms = response.data;
			$scope.vsms = vsms;
		});		
	};
	
	refresh();
	
	$scope.add = function() {
		console.log($scope.vsm);
		
		$http.post('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/listpatientid/95746', $scope.vsm).then(function(response) {
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
			$scope.vsm = response.data;
		});
	};
	
	$scope.update = function() {
		console.log($scope.vsm.id);
		
		$http.put('http://mywildflyrestv2-emafazillah.rhcloud.com/api/tblpatientvsms/' + $scope.vsm.id, $scope.vsm).then(function(response) {
			refresh();
		});
	};
	
	$scope.clear = function() {
		$scope.vsm = null;
	};
	
}]);