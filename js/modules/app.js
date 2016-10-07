(function() {
	var app = angular.module('caSearch', []);

	app.controller('CaController', ['$scope', '$http', function($scope, $http) {
		$scope.query = {};
		$scope.cas = [];
		$scope.fetching = false;
		$scope.index=0;


		this.submitForm = function() {
			$scope.fetching = true;

			if ($scope.query.equipment != null)
				$scope.query.equipment = $scope.query.equipment.toUpperCase();

			$http({
				url: "http://192.168.25.11:4567/ca",
				method: "GET",
				params: $scope.query
			}).success(function(data) {
				$scope.cas = data;
				$scope.error = "";
				$scope.fetching=false;
			}).error(function() {
				$scope.error = "Aconteceu um erro."
				$scope.fetching=false;
			});

			console.log($scope.query);
			$scope.query = {};
			$scope.searchForm.$setPristine();
		};


		this.orderBy = function(field) {
			$scope.orderCriteria = field;
			$scope.orderDirection = !$scope.orderDirection;
		};

		this.clear = function(){
			ca={};
		};

	}]);
})();