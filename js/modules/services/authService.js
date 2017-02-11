(function() {

    'use strict';

    angular.module('pulu.auth',[]).factory('authService', function($q, $state, $localStorage, Http, UserService, $rootScope) {

        var prefix = 'logged';
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
            userLogin: function(fd) {
                posting.login = true;
                var process = $q.defer();
                Http.post('/login', fd).then(function(response) {
                    authenticationSucceeded(response);
                    process.resolve(response.user);
                    posting.login = false;
                }, function(response) {
                    if (response.error) {
                        if (response.error.message.contains('PASSWORD_INVALID')) {
                            process.reject('Senha incorreta.');
                        } else if (response.error.message.contains('USER_NON_EXISTENT')) {
                            process.reject('Usuário não encontrado, favor contatar o administrador do sistema.');
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
