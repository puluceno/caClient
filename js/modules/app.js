(function() {
	var app = angular.module('caSearch', []);

	app.controller('CaController', ['$scope', '$http', function($scope, $http) {
		$scope.query = {};
		$scope.cas = [];
		this.submitForm = function() {
			$http({
				url: "http://localhost:4567/ca",
				method: "GET",
				params: $scope.query
			}).success(function(data) {
				$scope.cas = data;
			});
			//$http.get("http://localhost:4567/ca", $scope.query).

			console.log($scope.cas);
			console.log($scope.query);
			$scope.query = {};
			$scope.searchForm.$setPristine();
		};
	}]);
})();