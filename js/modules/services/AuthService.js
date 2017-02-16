(function() {

    'use strict';

    angular.module('pulu.auth', []).factory('AuthService',
        function($q, $state, $localStorage, Http, UserService, $rootScope) {
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
                location.reload();
            };

            if (session.authenticated) {
                Http.setAuthenticationToken(session.info.token);
                UserService.fetchUserInfo(session.info.token).then(function(response) {
                    // token still valid
                    broadcastLogin(events.in);

                }, function(response) {
                    // token expired or logged out
                    revokeUser();
                });
            }

            var authenticationSucceeded = function(response) {
                session.info = response;
                session.authenticated = true;
                Http.setAuthenticationToken(session.info.token);
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
                    Http.postFormData('login', fd)
                        .then(function(response) {
                            posting.login = false;
                            authenticationSucceeded(response);
                            process.resolve(response.user);
                        }, function(response) {
                            posting.login = false;
                            if (response) {
                                if (response.data === ('PASSWORD_INVALID')) {
                                    process.reject('Senha incorreta.');
                                } else if (response.data === ('USER_NON_EXISTENT')) {
                                    process.reject('Usuário não encontrado, favor contatar o administrador do sistema.');
                                } else {
                                    process.reject(response);
                                }
                            }
                        });
                    posting.login = false;
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
                },

                getSession: function() {
                    return session;
                },

                getProfile: function(){
                  return session.info.profile;
                }
            };
            return service;
        });

})();
