app.controller("userController", ['$scope', 'sha256', '$timeout', 'Http', function($scope, sha256, $timeout, Http) {
    $scope.session = {};

    this.doLogin = function() {
        $scope.loggingIn = true;
        var fd = new FormData();
        $scope.user.password = sha256.convertToSHA256($scope.user.password);
        fd.append("data", angular.toJson($scope.user));
        Http.postFormData("login", fd)
            .then(function successCallback(data) {
                if (data == "USER_NON_EXISTENT") {
                    $scope.error = true;
                    $scope.mainErrorMsg = "Usuário não encontrado, favor contatar o administrador do sistema."
                    $timeout(function() {
                        $scope.error = false;
                    }, 15000);
                } else if (data == "PASSWORD_INVALID") {
                    $scope.error = true;
                    $scope.mainErrorMsg = "Senha incorreta!"
                    $timeout(function() {
                        $scope.error = false;
                    }, 15000);
                } else {
                    $scope.session = data;
                    $scope.success = true;
                    $scope.mainSuccessMsg = "Bem vindo " + $scope.session.name + "!";
                    $timeout(function() {
                        $scope.success = false;
                    }, 15000);
                }
            }, function errorCallback(data) {
                $scope.error = true;
                $scope.mainErrorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            });
        $scope.loggingIn = false;
        $scope.user = {};
    };

    this.changePassword = function() {
        $scope.changingPassword = true;
        $scope.user.newPassword = sha256.convertToSHA256($scope.user.newPassword);
        Http.post("user/password", $scope.user.newPassword)
            .then(function successCallback(data) {
                angular.element(document.querySelector('#changePasswordModal')).modal('hide');
                $scope.changingPassword = false;
                $scope.success = true;
                $scope.mainSuccessMsg = "Senha alterada com sucesso!";
                $timeout(function() {
                    $scope.success = false;
                }, 15000);
            }, function errorCallback(data) {
                angular.element(document.querySelector('#changePasswordModal')).modal('hide');
                $scope.changingPassword = false;
                $scope.error = true;
                $scope.mainErrorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 15000);
            });
        $scope.changingPassword = false;
        $scope.user = {};
    };

    this.logout = function() {
        $scope.user.logged = false;
        $scope.user = {};
    };

}]);
