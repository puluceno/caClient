app.controller("footerController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    // var baseUrl = "http://perito2000.linkpc.net:4567/";
    var baseUrl = "http://localhost:4567/";

    this.getParams = function() {
        $http({
            url: baseUrl + "params",
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

    this.getCount = function() {
        $http({
            url: baseUrl + "ca/count",
            method: "GET"
        }).success(function(data) {
            $scope.CAcount = data;
            $scope.error = "";
            $scope.fetching = false;
        }).error(function() {
            $scope.error = "Aconteceu um erro!"
            $scope.fetching = false;
        });
    };

    this.getCount();
    this.getParams();

    this.updateFileUrl = function() {
        $scope.fileUrlUpdating = true;
        $http({
            url: baseUrl + "fileUrl",
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
            url: baseUrl + "updateDatabase",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).success(function(data) {
            $scope.lastUpdated = data.lastUpdated;
            $scope.updateCount = data.updateCount;
            $scope.error = "";
            $scope.databaseUpdating = false;
            $scope.databaseUpdateSuccess = true;
            $timeout(function() {
                $scope.databaseUpdateSuccess = false;
            }, 8000);
        }).error(function() {
            $scope.databaseUpdating = false;
            $scope.error = "Aconteceu um erro!"
        });
    };

    this.uploadCA = function() {
        $scope.uploadingCA = true;
        $timeout(function() {
            $scope.fileUrlUpdatedSucess = false;

            var file = $scope.newCA;
            var uploadUrl = baseUrl + "ca";
            var fd = new FormData();
            fd.append('newCA', file);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .success(function(data) {
                    $scope.uploadMessage = data;
                    $scope.uploadingCA = false;
                    $scope.uploadSuccess = true;
                    $timeout(function() {
                        $scope.uploadSuccess = false;
                    }, 8000);
                })
                .error(function(data) {
                    $scope.uploadMessage = data;
                    $scope.uploadingCA = false;
                    $scope.uploadSuccess = true;
                    $timeout(function() {
                        $scope.uploadSuccess = false;
                    }, 8000);
                });
            file = null;
            fd = null;

        }, 3000);
    };

}]);
