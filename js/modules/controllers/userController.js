app.controller('userController', ['$scope', 'sha256', '$timeout', 'Http', 'AuthService', 'UserService', '$state',
    function($scope, sha256, $timeout, Http, AuthService, UserService, $state) {

        $scope.user = {};
        $scope.session = AuthService.getSession().info;

        this.doLogin = function() {
            $scope.loggingIn = true;
            var fd = new FormData();
            $scope.user.password = sha256.convertToSHA256($scope.user.password);
            fd.append("data", angular.toJson($scope.user));
            AuthService.userLogin(fd)
                .then(function successCallback() {
                    $scope.session = AuthService.getSession().info;
                    $scope.success = true;
                    $scope.successMsg = "Bem vindo " + $scope.session.name + "!";
                    $state.go("ca");
                    $timeout(function() {
                        $scope.success = false;
                    }, 5000);
                }, function errorCallback(data) {
                    $scope.error = true;
                    $scope.errorMsg = data;
                    $timeout(function() {
                        $scope.error = false;
                    }, 4000);
                });
            $scope.loggingIn = AuthService.isPostingLogin();
            $scope.user = {};
        };

        this.changePassword = function() {
            $scope.changingPassword = true;
            $scope.user.newPassword = sha256.convertToSHA256($scope.user.newPassword);
            Http.post("api/user/password", $scope.user.newPassword)
                .then(function successCallback(data) {
                    angular.element(document.querySelector('#changePasswordModal')).modal('hide');
                    $scope.changingPassword = false;
                    $scope.success = true;
                    $scope.successMsg = "Senha alterada com sucesso!";
                    $timeout(function() {
                        $scope.success = false;
                    }, 15000);
                }, function errorCallback(data) {
                    angular.element(document.querySelector('#changePasswordModal')).modal('hide');
                    $scope.changingPassword = false;
                    $scope.error = true;
                    $scope.errorMsg = "Falha ao comunicar com o servidor."
                    $timeout(function() {
                        $scope.error = false;
                    }, 15000);
                });
            $scope.changingPassword = false;
            $scope.user = {};
        };

        this.logout = function() {
            AuthService.logout();
            $scope.user = {};
        };

        this.isAuthenticated = function() {
            return AuthService.isAuthenticated();
        };

        this.getLoggedUser = function() {
            return UserService.getLoggedUser();
        };

        this.isAdmin = function() {
            return AuthService.getProfile() === "admin";
        };

        this.isManager = function() {
            return AuthService.getProfile() === "manager";
        };

        this.isUser = function() {
            return AuthService.getProfile() === "user";
        };

    }
]);
