app.controller("caController", ['$scope', '$http', function($scope, $http) {

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
            // url: "http://perito2000.linkpc.net:4567/ca",
            url: "http://localhost:4567/ca",
            method: "GET",
            params: $scope.query
        }).success(function(data) {
            $scope.count = data[data.length - 1].count;
            data.splice(-1,1);
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

    this.getPdf = function(fileName) {
        return "http://localhost:8000/" + fileName;
        // return "http://perito2000.linkpc.net:90/CAs/" + fileName;
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
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

}]);
