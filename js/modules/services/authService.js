(function() {

    'use strict';

    angular.module('auth-service',[]).factory('authService', function($q, $state, $localStorage, Http, UserService, $rootScope) {

        var prefix = 'sc.logged.';
        var events = { in: prefix + 'in',
            out: prefix + 'out'
        };

        var broadcastLogin = function(evt) {
            evt = evt || events.in;
            $rootScope.$broadcast(evt);
        };

        var currentStorage = $localStorage;
        if (!currentStorage.session) {
            currentStorage.session = {
                authenticated: false,
                info: undefined
            };
        }

        var session = currentStorage.session;

        var posting = {
            login: false
        };

        var revokeUser = function() {
            broadcastLogin(events.out);
            session.authenticated = false;
            session.info = undefined;
            Http.setAuthenticationToken(undefined);
            $localStorage.$reset();
            $sessionStorage.$reset();
            location.reload();
        };

        if (session.authenticated) {
            Http.setAuthenticationToken(session.info.sessionId);
            UserService.fetchUserInfo(session.info.sessionId).then(function() {
                // token still valid
                broadcastLogin(events.in);

            }, function() {
                // token expired or logged out
                revokeUser();
            });
        }

        var authenticationSucceeded = function(response) {
            session.info = response.userInfo;
            session.authenticated = true;
            Http.setAuthenticationToken(session.info.sessionId);
            broadcastLogin(events.in);
        };

        var service = {

            authenticationSucceeded: authenticationSucceeded,
            /**
             *  Login for ADMIN users
             */
            userLogin: function(user) {
                posting.login = true;
                var process = $q.defer();
                Http.post('/auth/v1/user/login', user).then(function(response) {
                    authenticationSucceeded(response);
                    process.resolve(response.user);
                    posting.login = false;
                }, function(response) {
                    if (response.error) {
                        if (response.error.message.contains('INVALID_LOGIN')) {
                            process.reject('O email e/ou senha de autenticação não é válido.');
                        } else if (response.error.message.contains('NONEXISTENT_USER')) {
                            process.reject('O email inserido não possui cadastrado no sistema.');
                        } else if (response.error.message.contains('USER_INACTIVE')) {
                            process.reject('O usuário está inativo.');
                        } else if (response.error.message.contains('DEFAULT')) {
                            process.reject('Esta é uma sessão apenas para administradores. Por favor, faça login como aluno.');
                        } else {
                            process.reject(response);
                        }
                    }
                    posting.login = false;
                });
                return process.promise;
            },
            /**
             *
             */
            logout: function() {
                revokeUser();
            },

            /**
             *
             */
            reset: function(newPassword, resetToken) {
                var process = $q.defer();
                Http.post('/auth/v1/password/reset', {
                    password: newPassword,
                    token: resetToken
                }).then(function(response) {
                    process.resolve(response);
                }, function(response) {
                    if (response.error.message.contains('NONEXISTENT_TOKEN')) {
                        process.reject('Desculpe, o token da solicitação não existe ou já foi utilizado.');
                        $state.go('website-auth-login');
                    } else if (response.error.message.contains('EXPIRED_TOKEN')) {
                        process.reject('O token da solicitação expirou. Por favor, faça uma nova solicitação de alteração em esqueci minha senha.');
                    } else {
                        process.reject('Não foi possível alterar sua senha no momento. Por favor, tente novamente mais tarde.');
                    }
                });
                return process.promise;
            },

            /**
             *
             */
            isAuthenticated: function() {
                return session.authenticated;
            },

            /**
             *
             */
            isPostingLogin: function() {
                return posting.login;
            }
        };
        return service;
    });

})();
