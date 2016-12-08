(function() {
    var app = angular.module('caSearch', []);

    app.controller('CaController', ['$scope', '$http', '$location', '$window', '$timeout', function($scope, $http, $location, $window, $timeout) {

        this.initialize = function() {
            $scope.query = {};
            $scope.query.status = {};
            $scope.query.status.invalid = false;
            $scope.query.status.valid = false;
            $scope.cas = [];
            $scope.index = 0;
            this.getParams();
        };

        this.getParams = function() {
            $http({
                url: "http://perito2000.linkpc.net:4567/params",
                method: "GET"
            }).success(function(data) {
                $scope.fileUrl = data.fileUrl;
                $scope.lastUpdated = data.lastUpdated;
                $scope.error = "";
                $scope.fetching = false;
            }).error(function() {
                $scope.error = "Aconteceu um erro!"
                $scope.fetching = false;
            });
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
                url: "http://perito2000.linkpc.net:4567/ca",
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

        this.getKey = function(number) {
            $http({
                url: "http://perito2000.linkpc.net:4567/ca/key",
                method: "GET",
                params: {
                    "number": number
                }
            }).success(function(key) {
                $window.location.href = "https://consultaca.com/certificado?k=" + key;
            })
        };

        this.diffCheck = function(ca) {
            if ($scope.cas.length > 0) {
                for (var i = 0; i < $scope.cas.length; i++) {
                    if ((ca.approvedFor != $scope.cas[i].approvedFor) && (ca.number == $scope.cas[i].number)) {
                        return true;
                    }
                }
                return false;
            }
        };

        this.updateFileUrl = function() {
            $scope.fileUrlUpdating = true;
            $http({
                url: "http://perito2000.linkpc.net:4567/fileUrl",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: $scope.fileUrl
            }).success(function(data) {
                $scope.fileUrl = data.fileUrl;
                $scope.lastUpdated = data.lastUpdated;
                $scope.error = "";
                $scope.fileUrlUpdating = false;
                $scope.fileUrlUpdatedSucess = true;
                $timeout(function() {
                    $scope.fileUrlUpdatedSucess = false;
                }, 8000);
            }).error(function() {
                $scope.error = "Aconteceu um erro!"
                $scope.fileUrlUpdatedSucess = false;
                $scope.fileUrlUpdating = false;
            });
        };

        this.updateDatabase = function() {
            $scope.databaseUpdating = true;
            $http({
                url: "http://perito2000.linkpc.net:4567/updateDatabase",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).success(function(data) {
                $scope.lastUpdated = data.lastUpdated;
                $scope.error = "";
                $scope.databaseUpdating = false;
            }).error(function() {
                $scope.databaseUpdating = false;
                $scope.error = "Aconteceu um erro!"
            });
        };

    }]);
})();
