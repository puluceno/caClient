app.controller("footerController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    var baseUrl = "http://52.67.252.0:4567/";
    // var baseUrl = "http://localhost:4567/";
    var self = this;

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

    this.getEquipments = function() {
        $http({
            url: baseUrl + "equipment",
            method: "GET"
        }).success(function(data) {
            $scope.equipments = data;
        }).error(function() {
            $scope.insertError = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 15000);
        });
    };

    this.getCount();
    this.getParams();
    this.getEquipments();

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
                    }, 15000);
                })
                .error(function(data) {
                    $scope.uploadMessage = data;
                    $scope.uploadingCA = false;
                    $scope.uploadSuccess = true;
                    $timeout(function() {
                        $scope.uploadSuccess = false;
                    }, 15000);
                });
            file = null;
            fd = null;

        }, 3000);
    };

    $scope.formCA = {};
    $scope.reports = [{}];
    $scope.technicalRules = [{}];
    $scope.frequencies=["125","250","500","1000","2000","3150","4000","6300","8000","NRRsf"];
    $scope.formCA.attenuationTable = {"frequencies":[125,250,500,1000,2000,3150,4000,6300,8000,"NRRsf"],"dbAttenuations":new Array(10),"deviations":new Array(10)};

    this.addReportField = function() {
        $scope.reports.push({});
    };

    this.removeReportField = function(index) {
        $scope.reports.splice(index, 1);
    };

    this.addRuleField = function() {
        $scope.technicalRules.push({});
    };

    this.removeRuleField = function(index) {
        $scope.technicalRules.splice(index, 1);
    };

    this.clearForm = function() {
        $scope.formCA = {};
        $scope.reports = [{}];
        $scope.technicalRules = [{}];
        $scope.frequencies=["125","250","500","1000","2000","3150","4000","6300","8000","NRRsf"];
        $scope.formCA.attenuationTable = {"frequencies":[125,250,500,1000,2000,3150,4000,6300,8000,"NRRsf"],"dbAttenuations":new Array(10),"deviations":new Array(10)};
        $scope.createCAForm.$setPristine();
    };

    this.submitFormCA = function(file) {
        $scope.creatingFormCA = true;
        $scope.formCA.reports = [];
        $scope.formCA.reports.push(...$scope.reports);
        $scope.formCA.technicalRules = [];
        $scope.formCA.technicalRules.push(...$scope.technicalRules);
        $timeout(function() {
            var file = $scope.formCA.file
            var fd = new FormData();
            fd.append("file", file);
            fd.append("data", angular.toJson($scope.formCA));
            $http.post(baseUrl + "caform", fd, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity,
                params: {
                    fd
                }
            }).success(function(data) {
                $scope.creatingFormCA = false;
                $scope.formCASuccess = true;
                $scope.successMsgFooter = data;
                self.getCount();
                // self.clearForm();
                $timeout(function() {
                    $scope.formCASuccess = false;
                }, 15000);
            }).error(function(data) {
                $scope.creatingFormCA = false;
                $scope.formCAError = true;
                $scope.errorMsgFooter = data == null ? "O servidor está indisponível" : data;
                $timeout(function() {
                    $scope.formCAError = false;
                }, 15000);
            });
            angular.element(document.querySelector('#dialogInsertCA')).modal('hide');
        }, 1500);
    };

    this.uploadCAFormFile = function() {
        $scope.creatingFormCA = true;
        $timeout(function() {
            var file = $scope.formCA.file
            var fd = new FormData();
            fd.append("file", file);
            $http.post(baseUrl + "caformfile", fd, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    params: {
                        fd
                    }
                }).success(function(data) {
                    $scope.formCA = data;
                    $scope.formCA.file = file;
                    $scope.formCA.number = parseInt(data.number);
                    $scope.creatingFormCA = false;
                    $scope.formCASuccess = true;
                    $timeout(function() {
                        $scope.formCASuccess = false;
                    }, 15000);
                })
                .error(function(data) {
                    $scope.creatingFormCA = false;
                    $scope.formCAError = true;
                    $scope.errorMsgFooter = data == null ? "O servidor está indisponível" : data;
                    $timeout(function() {
                        $scope.formCAError = false;
                    }, 15000);
                });
        }, 1500);
    };


}]);
