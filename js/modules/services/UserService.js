(function() {

    'use strict';

    angular.module('pulu.user', []).factory('UserService',
        function($log, $q, Http, Storage) {

            var loggedUser, userStorage = {},
                fetchingUser = false;

            var addStorage = function(storageName) {
                userStorage[storageName] = Storage.asList(storageName, {

                    fetch: function() {
                        var process = $q.defer();
                        var link = '/user/v1/list/' + storageName;

                        Http.get(link).then(function(response) {
                            process.resolve(response.users);
                        }, function(response) {
                            process.reject(response);
                        });
                        return process.promise;
                    },

                    create: function(args) {
                        var process = $q.defer();
                        Http.post('/user/v1/create', args).then(function(response) {
                            process.resolve(response.user);
                        }, function(response) {
                            if (response.error) {
                                if (response.error.message.contains('ENTITY_ALREADY_EXISTS')) {
                                    process.reject('O email inserido já possui cadastro.');
                                } else if (response.error.message.contains('INSUFFICIENT_PERMISSIONS')) {
                                    process.reject('Você deve ser um administrador para cadastrar novos usuários.');
                                } else {
                                    process.reject('O usuário não pôde ser criado neste momento. Tente novamente mais tarde.');
                                }
                            }
                        });
                        return process.promise;
                    },

                    update: function(args) {
                        var process = $q.defer();
                        Http.post('/user/v1/update', args).then(function(response) {
                            process.resolve(response);
                        }, function(response) {
                            if (response.error) {
                                if (response.error.message.contains('NONEXISTENT_ENTITY')) {
                                    process.reject('O usuário da edição não existe.');
                                } else {
                                    process.reject('O usuário não pôde ser editado neste momento. Tente novamente mais tarde.');
                                }
                            }
                        });
                        return process.promise;
                    },

                    delete: function(args) {
                        var process = $q.defer();
                        Http.delete('/user/v1/delete/' + args).then(function(response) {
                            process.resolve(response);
                        }, function(response) {
                            if (response.error) {
                                if (response.error.message.contains('NONEXISTENT_ENTITY')) {
                                    process.reject('O usuário enviado para exclusão não existe.');
                                } else {
                                    process.reject('O usuário não pôde ser excluído neste momento. Tente novamente mais tarde.');
                                }
                            }
                        });
                        return process.promise;
                    }

                });
            };

            var loadUserStorage = function() {
                addStorage('DEFAULT');
                if (loggedUser.role === 'admin') {
                    addStorage('admin');
                }
            };

            return {

                /**
                 * Sets logged user and his allowed user storages.
                 */
                setLoggedUser: function(user) {
                    loggedUser = user;
                    if (loggedUser) {
                        loggedUser.letter = user.name.charAt(0);
                    }
                    loadUserStorage();
                },

                /**
                 * Returns logged user.
                 */
                getLoggedUser: function() {
                    return loggedUser;
                },

                /**
                 * Fetches logged user info by request token.
                 */
                fetchUserInfo: function() {
                    var process = $q.defer();
                    fetchingUser = true;
                    Http.get('user/info').then(function(response) {
                        console.log(response);
                        fetchingUser = false;
                        loggedUser = response;
                        loggedUser.letter = response.name.charAt(0);
                        loadUserStorage();
                        process.resolve(response);
                    }, function(response) {
                        fetchingUser = false;
                        process.reject(response);
                    });
                    return process.promise;
                },
                /**
                 * Return locally stored entity.
                 */
                get: function(role, id) {
                    return userStorage[role].get(id);
                },
                /**
                 *
                 */
                fetch: function(role, id) {
                    var process = $q.defer();
                    Http.get('/user/v1/get/' + id).then(function(response) {
                        userStorage[role].insert(response);
                        process.resolve(response);
                    }, function(response) {
                        process.reject(response);
                    });
                    return process.promise;
                },

                /**
                 * Return locally stored list.
                 */
                list: function(role) {
                    if (!userStorage[role]) {
                        return [];
                    }
                    return userStorage[role].list();
                },

                /**
                 *
                 */
                fetchList: function(role, args) {
                    return userStorage[role].fetch(args);
                },

                /**
                 *
                 */
                create: function(role, user) {
                    return userStorage[role].put(user);
                },

                /**
                 *
                 */
                update: function(role, user) {
                    return userStorage[role].update(user);
                },

                /**
                 * Sends a DELETE request for removal of an existing entity.
                 */
                delete: function(role, id) {
                    return userStorage[role].delete(id);
                },

                /**
                 *
                 */
                changePassword: function(params) {
                    var process = $q.defer();
                    Http.post('/user/v1/changePass', params).then(function(response) {
                        process.resolve(response);
                    }, function(response) {
                        process.reject(response);
                    });
                    return process.promise;
                },

                /**
                 * Checks if the user info is being fetched
                 */
                isFetchingUser: function() {
                    return fetchingUser;
                }

            };

        });

})();
