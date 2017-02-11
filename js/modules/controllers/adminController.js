app.controller("adminController", ['$scope', 'sha256', '$timeout', 'Http', function($scope, sha256, $timeout, Http) {
    var self = this;

    this.getProfiles = function() {
        Http.get("profile")
            .then(function successCallback(data) {
                    $scope.profiles = data;
                },
                function errorCallback(data) {
                    $scope.error = true;
                    $scope.errorMsg = "Falha ao comunicar com o servidor."
                    $timeout(function() {
                        $scope.error = false;
                    }, 15000);
                })
    };

    this.getUsers = function() {
        Http.get("user")
            .then(function successCallback(data) {
                $scope.users = data;
            }, function errorCallback(data) {
                $scope.error = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            })
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
        Http.postFormData("user", fd)
            .then(function successCallback(data) {
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
                }, 15000);
            }, function errorCallback(data) {
                $scope.error = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            });
        $scope.newUser = {};
        $scope.form.newUserForm.$setPristine();
    };

    this.update = function(updateUser) {
        $scope.fetching = true;
        var fd = new FormData();
        fd.append("data", angular.toJson(updateUser));
        Http.postFormData("user", fd)
            .then(function successCallback(data) {
                if (data.data == "USER_ALREADY_EXISTS") {
                    $scope.successMsg = "Usuário já existe!"
                } else {
                    $scope.users = data;
                    $scope.successMsg = "Usuário atualizado!"
                }
                $scope.fetching = false;
                $scope.success = true;
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
    };

    this.delete = function(id) {
        $scope.fetching = true;
        Http.deleteParam("user", id)
            .then(function successCallback(data) {
                $scope.users = data;
                $scope.success = true;
                $scope.successMsg = "Usuário removido!"
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
