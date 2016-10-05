(function() {
	var app = angular.module('caSearch', []);
	app.controller('CaController', ['$scope', '$http', function($scope, $http) {
		$scope.query = {};
		$scope.cas = [];
		this.submitForm = function() {
			if ($scope.query.equipment != null)
				$scope.query.equipment = $scope.query.equipment.toUpperCase();
			$http({
				url: "http://localhost:4567/ca",
				method: "GET",
				params: $scope.query
			}).success(function(data) {
				$scope.cas = data;
				$scope.error = "";
			}).error(function() {
				$scope.error = "Aconteceu um erro."
			});
			$scope.query = {};
			$scope.searchForm.$setPristine();
		};
		this.orderBy = function(field) {
			$scope.orderCriteria = field;
			$scope.orderDirection = !$scope.orderDirection;
		};
	}]);
})();