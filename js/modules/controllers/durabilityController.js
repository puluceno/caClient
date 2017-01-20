app.controller("durabilityController", ['$scope', '$http', 'Upload', '$timeout', function($scope, $http, Upload, $timeout) {
    // var baseUrl = "http://perito2000.linkpc.net:4567/";
    // var downloadUrl = "http://perito2000.linkpc.net:90/files/";
    var baseUrl = "http://localhost:4567/";
    var downloadUrl = "http://localhost:8000/";
    var self = this;

    this.getDurabilities = function() {
        $http({
            url: baseUrl + "durability",
            method: "GET"
        }).success(function(data) {
            $scope.durabilities = data;
        }).error(function() {
            $scope.insertError = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 12000);
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
            }, 12000);
        });
    };

    this.getMaterials = function() {
        $http({
            url: baseUrl + "material",
            method: "GET"
        }).success(function(data) {
            $scope.materials = data;
        }).error(function() {
            $scope.insertError = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 12000);
        });
    };

    this.init = function() {
        $scope.newDurability = {};
        this.getEquipments();
        this.getMaterials();
        this.getDurabilities();
    };

    this.init();


    this.createNew = function(file) {
        $scope.fetching = true;
        var file = $scope.newDurability.file
        var fd = new FormData();
        fd.append("file", file);
        fd.append("data", angular.toJson($scope.newDurability));
        $http.post(baseUrl + "durability", fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd
            }
        }).success(function(data) {
            $scope.fetching = false;
            $scope.durabilities = data;
            $scope.success = true;
            $scope.successMsg = "Durabilidade adicionada!"
            self.getMaterials();
            $timeout(function() {
                $scope.success = false;
            }, 12000);
        }).error(function(status) {
            $scope.insertError = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $scope.fetching = false;
            $timeout(function() {
                $scope.error = false;
            }, 12000);
        });
        $scope.createDurabilityForm.$setPristine();
        $scope.newDurability = {};
    };

    this.update = function(durability) {
        $scope.fetching = true;
        var file = durability.file
        var fd = new FormData();
        fd.append("file", file);
        fd.append("data", angular.toJson(durability));
        $http.post(baseUrl + "durability", fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd
            }
        }).then(function successCallback(data) {
                console.log(data);
                $scope.durabilities.length = 0;
                Array.prototype.push.apply($scope.durabilities, data.data);
                $scope.fetching = false;
                $scope.success = true;
                $scope.successMsg = "Durabilidade atualizada!"
                self.getMaterials();
                $timeout(function() {
                    $scope.success = false;
                }, 12000);
            },
            function errorCallback(status) {
                $scope.error = true;
                $scope.errorMsg = "Aconteceu um erro!"
                $scope.fetching = false;
                $timeout(function() {
                    $scope.error = false;
                }, 12000);
            });
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
    };

    this.delete = function(id) {
        $scope.fetching = true;
        $http({
            url: baseUrl + "durability",
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                "id": id
            }
        }).success(function(data) {
            $scope.durabilities = data;
            $scope.success = true;
            $scope.successMsg = "Durabilidade removida!"
            $scope.fetching = false;
            $timeout(function() {
                $scope.success = false;
            }, 12000);
        }).error(function() {
            $scope.insertError = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $scope.fetching = false;
            $timeout(function() {
                $scope.error = false;
            }, 12000);
        });
    };

    this.getFile = function(fileName) {
        return downloadUrl + fileName;
    };

    this.printMaterials = function(data) {
        return data.map(function(elem) {
            return elem.text;
        }).join(", ");
    };

    $scope.loadMaterials = function($query) {
        var materials = $scope.materials;
        return materials.filter(function(materials) {
            return materials.text.indexOf($query.toLowerCase()) != -1;
        });
    };

}]);
