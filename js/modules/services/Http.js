(function() {

	'use strict';

	angular.module('pulu.network', []).factory('Http',
		function($log, $q, $http, $timeout) {

			// var apiPath = 'http://localhost:4567/';
			var apiPath = "http://52.67.252.0:4567/";

			return {

				/**
				 * Sets authentication token to be put inside all header requests.
				 */
				setAuthenticationToken: function(token) {
					$http.defaults.headers.common.token = token;
				},

				/**
				 * Creates a GET http call for the given url.
				 */
				get: function(url, getParams) {
					var process = $q.defer();

					var promise = getParams ? $http.get(apiPath + url, {
						params: getParams
					}) : $http.get(apiPath + url);

					promise.then(function(res) {
							if (res && res.status >= 200 && res.status < 300) {
								process.resolve(res.data);
							} else {
								process.reject(res.data);
							}
						})
						.catch(function(err) {
							process.reject(err && err.error);
						});
					return process.promise;
				},

				/**
				 * Creates a POST http call for the given url.
				 */
				post: function(url, args) {
					var process = $q.defer();
					$http.post(apiPath + url, args)
						.then(function(res) {
							if (res && res.status >= 200 && res.status < 300) {
								process.resolve(res.data);
							} else {
								process.reject(res.data);
							}
						})
						.catch(function(err) {
							process.reject(err && err);
						});
					return process.promise;
				},
				/**
				 * Creates a POST FormData http call for the given url.
				 */
				postFormData: function(url, fd) {
					var process = $q.defer();
					$http.post(apiPath + url, fd, {
							headers: {
								'Content-Type': undefined
							},
							transformRequest: angular.identity,
							params: {
								fd
							}
						})
						.then(function(res) {
							if (res && res.status >= 200 && res.status < 300) {
								process.resolve(res.data);
							} else {
								process.reject(res.data);
							}
						})
						.catch(function(err) {
							process.reject(err);
						});
					return process.promise;
				},

				/**
				 * Creates a DELETE http call for the given url.
				 */
				delete: function(url) {
					var process = $q.defer();
					$http.delete(apiPath + url)
						.then(function(res) {
							if (res && res.status >= 200 && res.status < 300) {
								process.resolve(res.data);
							} else {
								process.reject(res.data);
							}
						})
						.catch(function(err) {
							process.reject(err && err.error);
						});
					return process.promise;
				},

				/**
				 * Creates a DELETE http call for the given url and parameters
				 **/
				deleteParam: function(url, id) {
					var process = $q.defer();
					$http({
							url: apiPath + url,
							method: "DELETE",
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							params: {
								"id": id
							}
						})
						.then(function(res) {
							if (res && res.status >= 200 && res.status < 300) {
								process.resolve(res.data);
							} else {
								process.reject(res.data);
							}
						})
						.catch(function(err) {
							process.regect(err && err.error);
						});
					return process.promise;
				}
			};

		});

})();
