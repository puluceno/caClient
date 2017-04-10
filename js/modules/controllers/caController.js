app.controller("caController", ['$scope', '$timeout', 'Http', function($scope, $timeout, Http) {
    // var downloadUrl = 'http://localhost:8000/';
    var downloadUrl = "http://52.67.252.0/CAs/";

    this.initialize = function() {
        $scope.query = {};
        $scope.query.status = {};
        $scope.query.status.invalid = false;
        $scope.query.status.valid = false;
        $scope.cas = [];
        $scope.index = 0;
    };

    this.submitForm = function() {
        $scope.fetching = true;

        if ($scope.query != null) {
            if ($scope.query.equipment != null)
                $scope.query.equipment = $scope.query.equipment.toUpperCase();
            if ($scope.query.company != null)
                $scope.query.company = $scope.query.company.toUpperCase();
            if ($scope.query.status != null) {
                if ($scope.query.status.valid) {
                    $scope.query.status = "VÁLIDO";
                } else if ($scope.query.status.invalid) {
                    $scope.query.status = "VENCIDO";
                } else if (($scope.query.status.invalid && $scope.query.status.valid) || (!$scope.query.status.invalid && !$scope.query.status.valid)) {
                    $scope.query.status = null;
                }
            }
        }

        Http.get("api/ca", $scope.query)
            .then(function successCallback(data) {
                $scope.count = data[data.length - 1].count;
                data.splice(-1, 1);
                $scope.cas = data;
                $scope.fetching = false;
            }, function errorCallback(data) {
                $scope.fetching = false;
                $scope.error = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 10000);
            });
        this.initialize();
        $scope.searchForm.$setPristine();
    };

    this.getPdf = function(fileName) {
        return downloadUrl + fileName;
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
    };

    this.diffCheck = function(ca) {
        if ($scope.cas.length > 0) {
            for (var i = 0; i < $scope.cas.length; i++) {
                if (((ca.approvedFor != $scope.cas[i].approvedFor) && (ca.number == $scope.cas[i].number))) {
                    return true;
                }
            }
            return false;
        }
    };

    this.delete = function(ca) {
        $scope.fetching = true;

        Http.deleteParam("api/ca", ca._id.$oid)
            .then(function successCallback() {
                $scope.success = true;
                $scope.successMsg = "CA " + ca.number + " removido!"
                $scope.query = {
                    number: ca.number,
                    exactSearch: true
                }
                self.submitForm();
                $scope.fetching = false;
                $timeout(function() {
                    $scope.success = false;
                }, 15000);
            }, function errorCallback(data) {
                $scope.error = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            });
        $scope.searchForm.$setPristine();
    };

    this.compare = function(ca) {
        $scope.caFound = $.grep($scope.cas, function(n, i) {
            return n.number == ca.number;
        });
        angular.element(document.querySelector('#compareCaModal')).modal('show');
    };

    this.updateCA = function(map) {
        $scope.updatingCA = true;
        Http.post("api/updateca", map)
            .then(function successCallback(data) {
                $scope.updatingCA = false;
                $scope.updateSuccess = true;
                $scope.updateSuccessMsg = "CA atualizado!"
                $timeout(function() {
                    $scope.updateSuccess = false;
                }, 15000);
            }, function errorCallback(data) {
                $scope.updatingCA = false;
                $scope.updateError = true;
                $scope.updateErrorMsg = "Falha ao atualizar o CA."
                $timeout(function() {
                    $scope.updateSError = false;
                }, 15000);
            })
    };

    var self = this;
}]);
