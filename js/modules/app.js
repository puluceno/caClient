(function() {
    var app = angular.module('caSearch', []);

    app.controller('CaController', ['$scope', '$http', function($scope, $http) {

        this.initialize = function() {
            $scope.query = {};
            $scope.query.status = {};
            $scope.query.status.invalid = false;
            $scope.query.status.valid = false;
            $scope.cas = [];
            $scope.index = 0;
        };

        this.initialize();

        this.submitForm = function() {
            $scope.fetching = true;

            if ($scope.query.equipment != null)
                $scope.query.equipment = $scope.query.equipment.toUpperCase();
            if ($scope.query.company != null)
                $scope.query.company = $scope.query.company.toUpperCase();
            if ($scope.query.status.valid) {
                $scope.query.status = "VÁLIDO";
            } else if ($scope.query.status.invalid) {
                $scope.query.status = "VENCIDO";
            } else if (($scope.query.status.invalid && $scope.query.status.valid) || (!$scope.query.status.invalid && !$scope.query.status.valid)) {
                $scope.query.status = null;
            }

            $http({
                url: "http://localhost:4567/ca",
                method: "GET",
                params: $scope.query
            }).success(function(data) {
                $scope.cas = data;
                $scope.error = "";
                $scope.fetching = false;
            }).error(function() {
                $scope.error = "Aconteceu um erro!"
                $scope.fetching = false;
            });

            $scope.searchForm.$setPristine();
            this.initialize();
        };

        this.orderBy = function(field) {
            $scope.orderCriteria = field;
            $scope.orderDirection = !$scope.orderDirection;
        };

        app.directive("detailModal", function() {
            return {
                restrict: 'E',
                templateUrl: 'detail-modal.html'
            };
        });

    }]);
})();
