app.controller("footerController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    this.getParams = function() {
        $http({
            url: "http://perito2000.linkpc.net:4567/params",
            // url: "http://localhost:4567/params",
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
          url: "http://localhost:4567/ca/count",
            // url: "http://perito2000.linkpc.net:4567/ca/count",
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
            url: "http://perito2000.linkpc.net:4567/fileUrl",
            // url: "http://localhost:4567/fileUrl",
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
            // url: "http://localhost:4567/updateDatabase",
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
      $scope.uploadingCA=true;
        $timeout(function() {
            $scope.fileUrlUpdatedSucess = false;

            var file = $scope.newCA;
            // var uploadUrl = "http://localhost:4567/ca";
            var uploadUrl = "http://perito2000.linkpc.net:4567/ca";
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
                    $scope.uploadingCA=false;
                    $scope.uploadSuccess = true;
                    $timeout(function() {
                        $scope.uploadSuccess = false;
                    }, 8000);
                })
                .error(function(data) {
                    $scope.uploadMessage = data;
                    $scope.uploadingCA=false;
                    $scope.uploadSuccess = true;
                    $timeout(function() {
                        $scope.uploadSuccess = false;
                    }, 8000);
                });
                file=null;
                fd=null;

        }, 3000);
    };

}]);
