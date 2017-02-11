app.controller("durabilityController", ['$scope', 'Http', 'Upload', '$timeout', function($scope, Http, Upload, $timeout) {
    // var downloadUrl = "http://52.67.252.0/files/";
    var downloadUrl = "http://localhost:8000/";
    var self = this;

    this.getDurabilities = function() {
        Http.get("durability")
            .then(function successCallback(data) {
                $scope.durabilities = data;
            }, function errorCallback(data) {
                $scope.insertError = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            })
    };

    this.getEquipments = function() {
        Http.get("equipment")
            .then(function successCallback(data) {
                $scope.equipments = data;
            }, function errorCallback(data) {
                $scope.insertError = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            })
    };

    this.getMaterials = function() {
        Http.get("material")
            .then(function successCallback(data) {
                $scope.materials = data;
            }, function errorCallback(data) {
                $scope.insertError = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            })
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
        Http.postFormData("durability", fd)
            .then(function successCallback(data) {
                $scope.fetching = false;
                $scope.durabilities = data;
                $scope.success = true;
                $scope.successMsg = "Durabilidade adicionada!"
                self.getMaterials();
                $timeout(function() {
                    $scope.success = false;
                }, 15000);
            }, function errorCallback(data) {
                $scope.insertError = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
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
        Http.postFormData("durability", fd)
            .then(function successCallback(data) {
                    $scope.durabilities.length = 0;
                    Array.prototype.push.apply($scope.durabilities, data);
                    $scope.fetching = false;
                    $scope.success = true;
                    $scope.successMsg = "Durabilidade atualizada!"
                    self.getMaterials();
                    $timeout(function() {
                        $scope.success = false;
                    }, 15000);
                },
                function errorCallback(status) {
                    $scope.error = true;
                    $scope.errorMsg = "Falha ao comunicar com o servidor."
                    $scope.fetching = false;
                    $timeout(function() {
                        $scope.error = false;
                    }, 15000);
                });
    };

    this.delete = function(id) {
        $scope.fetching = true;

        Http.deleteParam("durability", id)
            .then(function successCallback(data) {
                $scope.durabilities = data;
                $scope.success = true;
                $scope.successMsg = "Durabilidade removida!"
                $scope.fetching = false;
                $timeout(function() {
                    $scope.success = false;
                }, 15000);
            }, function errorCallback(data) {
                $scope.insertError = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            })
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
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
