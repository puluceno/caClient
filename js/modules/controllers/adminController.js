app.controller("adminController", ['$scope', '$http', 'sha256', '$timeout', function($scope, $http, sha256, $timeout) {
    // var baseUrl = "http://52.67.252.0:4567/";
    var baseUrl = "http://localhost:4567/";

    var self = this;

    this.getProfiles = function() {
        $http({
            url: baseUrl + "profile",
            method: "GET"
        }).success(function(data) {
            $scope.profiles = data;
        }).error(function() {
            $scope.error = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 15000);
        });
    };

    this.getUsers = function() {
        $http({
            url: baseUrl + "user",
            method: "GET"
        }).success(function(data) {
            $scope.users = data;
        }).error(function() {
            $scope.error = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 15000);
        });
    };

    this.init = function() {
        $scope.newUser = {};
        $scope.form = {};
        $scope.users = [];
        this.getProfiles();
        this.getUsers();
    };

    this.init();

    this.createUser = function() {
        $scope.fetching = true;
        var fd = new FormData();
        $scope.newUser.password = sha256.convertToSHA256($scope.newUser.password);
        fd.append("data", angular.toJson($scope.newUser));
        $http.post(baseUrl + "user", fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd
            }
        }).success(function(data) {
            if (data == "USER_ALREADY_EXISTS") {
                $scope.successMsg = "Usuário já existe!"
            } else {
                $scope.users = data;
                $scope.successMsg = "Usuário criado!"
            }
            $scope.fetching = false;
            $scope.success = true;
            $timeout(function() {
                $scope.success = false;
            }, 12000);
        }).error(function(data) {
            $scope.error = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $scope.fetching = false;
            $timeout(function() {
                $scope.error = false;
            }, 12000);
        });
        $scope.newUser = {};
        $scope.form.newUserForm.$setPristine();
    };

    this.update = function(updateUser) {
        $scope.fetching = true;
        var fd = new FormData();
        fd.append("data", angular.toJson(updateUser));
        $http.post(baseUrl + "user", fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd
            }
        }).then(function successCallback(data) {
                if (data.data == "USER_ALREADY_EXISTS") {
                    $scope.successMsg = "Usuário já existe!"
                } else {
                    $scope.users = data;
                    $scope.successMsg = "Usuário atualizado!"
                    $scope.users = data.data;
                }
                $scope.fetching = false;
                $scope.success = true;
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

    this.delete = function(id) {
        $scope.fetching = true;
        $http({
            url: baseUrl + "user",
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                "id": id
            }
        }).success(function(data) {
            $scope.users = data;
            $scope.success = true;
            $scope.successMsg = "Usuário removido!"
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

    this.tab = 1;
    this.isSet = function(checkTab) {
        return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
        this.tab = setTab;
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
    };

}]);
