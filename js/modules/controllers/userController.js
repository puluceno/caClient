app.controller("userController", ['$scope', '$http', 'sha256', '$timeout', function($scope, $http, sha256, $timeout) {
    var baseUrl = "http://localhost:4567/";

    $scope.session = {};

    this.doLogin = function() {
        $scope.loggingIn = true;
        var fd = new FormData();
        $scope.user.password = sha256.convertToSHA256($scope.user.password);
        fd.append("data", angular.toJson($scope.user));
        $http.post(baseUrl + "login", fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd
            }
        }).success(function(data) {
            if (data == "USER_NON_EXISTENT") {
                $scope.error = true;
                $scope.errorMsg = "Usuário não encontrado!"
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            } else if (data == "PASSWORD_INVALID") {
                $scope.error = true;
                $scope.errorMsg = "Senha incorreta!"
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            } else {
                console.log(data);
                $scope.session = data;
                $scope.success = true;
                $scope.successMsg = "Bem vindo " + data.name+"!";
                $timeout(function() {
                    $scope.success = false;
                }, 15000);
            }
        }).error(function(status) {
            $scope.error = true;
            $scope.errorMsg = "Aconteceu um erro!"
            $timeout(function() {
                $scope.error = false;
            }, 15000);
        });
        $scope.loggingIn = false;
        $scope.user = {};
    };

    this.logout = function() {
        $scope.user.logged = false;
        $scope.user = {};
    };

}]);
