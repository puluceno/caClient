(function() {

	'use strict';

	/**
	 *
	 *	Storage configuration example.
	 *
	 *	var storageConfigExample = {
	 *		entityId: 'assignOnlyIfNotDefault', //default 'id'
	 *		persistent: true, // defaults to false
	 *		fetch: function(){},
	 *		create: function(){},
	 *		update: function(){},
	 *		delete: function(){}
	 *	};
	 *
	 **/

	angular.module('pulu.storage', []).factory('Storage',
		function($q, $localStorage) {

			var EntityModel = function() {
				this.entity = undefined;
				this.syncFailed = undefined;
			};

			var ListModel = function() {
				this.list = [];
				this.indexes = {};
				this.syncFailed = {};
			};

			var warnMessageFunction = function(method, storageName) {
				return function() {
					var message = 'Warning: Method ' + method + ' was not implemented for the storage ' + storageName + '.';
					var warningProcess = $q.defer();
					warningProcess.reject(message);
					return warningProcess.promise;
				};
			};

			var Storage = function(storageName, config, list) {

				// about the storage
				this.name = storageName;
				this.isList = list === 'list' ? true : false;
				this.isEntity = !this.isList;

				// general configs
				this.config = config;

				// methods
				this.config.fetch = this.config.fetch ? this.config.fetch : warnMessageFunction('fetch', storageName);
				this.config.create = this.config.create ? this.config.create : warnMessageFunction('create', storageName);
				this.config.update = this.config.update ? this.config.update : warnMessageFunction('update', storageName);
				this.config.delete = this.config.delete ? this.config.delete : warnMessageFunction('delete', storageName);

				// defaults
				this.config.persistent = !!config.persistent;
				this.entityId = config.entityId ? config.entityId : 'id';

				// process
				this.fetchingProcess = undefined;

				if (this.config.persistent) {
					if (!$localStorage[this.name]) {
						$localStorage[this.name] = this.isList ? new ListModel() : new EntityModel();
					}
					this.data = $localStorage[this.name];
				} else {
					this.data = this.isList ? new ListModel() : new EntityModel();
				}

			};

			/**
			 * Gets a local entity by id.
			 */
			Storage.prototype.get = function(id) {
				if (this.isEntity) {
					return this.data.entity;
				} else {
					if (this.config.numericId) {
						id = parseInt(id);
					}
					var listIndex = this.data.indexes[id];
					if (listIndex !== undefined) {
						return this.data.list[listIndex];
					}
				}
			};

			/**
			 * Gets an array of entities by ids.
			 */
			Storage.prototype.getByIds = function(ids) {
				if (this.isList && Array.isArray(ids)) {
					var data = [];
					for (var index = 0, length = ids.length; index < length; index++) {
						var storedData = this.get(ids[index]);
						if (storedData) {
							data.push(storedData);
						}
					}
					return data;
				}
			};

			/**
			 * Gets an array of entities ignoring param ids.
			 */
			Storage.prototype.getByIgnoredIds = function(ids) {
				if (this.isList && Array.isArray(ids)) {
					var data = [];
					for (var dataIndex = 0, dataLength = this.data.list.length; dataIndex < dataLength; dataIndex++) {
						var entity = this.data.list[dataIndex];
						if (!ids.contains(entity[this.entityId])) {
							data.push(entity);
						}
					}
					return data;
				}
			};

			/**
			 * Gets an array with all stored entities.
			 */
			Storage.prototype.list = function() {
				if (this.isList) {
					return this.data.list;
				} else {
					return this.data.entity;
				}
			};

			/**
			 * Puts an entity syncing with server.
			 */
			Storage.prototype.put = function(entity, args) {
				var storage = this;
				var process = $q.defer();
				storage.config.create(entity).then(function(response) {
					storage.insert(response, args);
					process.resolve(response);
				}, function(response) {
					process.reject(response);
				});
				return process.promise;
			};

			/**
			 * Inserts an entity without syncing with server.
			 */
			Storage.prototype.insert = function(entity) {
				if (this.isList) {
					if (!entity) {
						return;
					}
					var id = entity[this.entityId];
					if (this.contains(id)) {
						// updates existing data
						this.data.list[this.data.indexes[id]] = entity;
					} else {
						// inserts new data
						this.data.list.push(entity);
						this.data.indexes[id] = this.data.list.length - 1;
					}

				} else {
					this.data.entity = entity;
				}
			};

			/**
			 * Inserts all entities without syncing with server.
			 */
			Storage.prototype.insertAll = function(entityList) {
				if (entityList) {
					for (var entityIndex = 0; entityIndex < entityList.length; entityIndex++) {
						this.insert(entityList[entityIndex]);
					}
				}
			};

			/**
			 * Updates an entity syncing with server.
			 */
			Storage.prototype.update = function(entity, args) {
				var storage = this;
				var process = $q.defer();
				var localEntity = angular.copy(entity);
				storage.config.update(entity).then(function(response) {
					storage.insert(localEntity, args);
					process.resolve(response);
				}, function(response) {
					process.reject(response);
				});
				return process.promise;
			};

			/**
			 * Replaces all entities without syncing with server.
			 */
			Storage.prototype.replace = function(entity) {
				if (this.isList) {
					var id = entity[this.entityId];
					if (id !== undefined) {
						var listIndex = this.data.indexes[id];
						if (listIndex !== undefined) {
							this.data.list[listIndex] = entity;
						}
					}
				} else {
					this.data.entity = entity;
				}
			};

			/**
			 * Deletes an entity syncing with server.
			 */
			Storage.prototype.delete = function(id, args) {
				var storage = this;
				var process = $q.defer();
				storage.config.delete(id, args).then(function(response) {
					storage.remove(id);
					process.resolve(response);
				}, function(response) {
					process.reject(response);
				});
				return process.promise;
			};

			/**
			 * Removes an entity without syncing with server.
			 */
			Storage.prototype.remove = function(id) {
				if (this.isList) {
					var listIndex = this.data.indexes[id];
					if (listIndex !== undefined) {
						this.data.list.splice(listIndex, 1);
						this.reloadIndexes();
						return true;
					}
				} else {
					this.data.entity = undefined;
					return true;
				}
			};

			Storage.prototype.removeAll = function() {
				if (this.isList) {
					this.data.list.length = 0;
					this.data.indexes = {};
					return true;
				} else {
					return this.remove();
				}

			};

			/**
			 * Check if entity either exists or not.
			 */
			Storage.prototype.contains = function(id) {
				return this.isList && this.data.indexes[id] !== undefined;
			};

			/**
			 * Reload all stored indexes.
			 */
			Storage.prototype.reloadIndexes = function() {
				this.data.indexes = {};
				for (var listIndex = 0, listLength = this.data.list.length; listIndex < listLength; listIndex++) {
					this.data.indexes[this.data.list[listIndex][this.entityId]] = listIndex;
				}
			};

			/**
			 * Fetch new list of entities from server.
			 */
			Storage.prototype.fetch = function(args) {
				var storage = this;
				if (!storage.fetchingProcess) {
					storage.fetchingProcess = $q.defer();
					storage.config.fetch(args).then(function(response) {
						storage.parseFetchResponse(response);
						storage.fetchingProcess.resolve(response);
						storage.fetchingProcess = undefined;
					}, function(response) {
						storage.fetchingProcess.reject(response);
						storage.fetchingProcess = undefined;
					});
				}
				return storage.fetchingProcess.promise;
			};

			/**
			 * Parses fetch response.
			 */
			Storage.prototype.parseFetchResponse = function(response) {
				var storage = this;
				if (response && storage.isList) {
					storage.insertAll(response);
				} else if (response && storage.isEntity) {
					storage.insert(response);
				}
			};

			/**
			 * Checks if the is a fetch in process.
			 */
			Storage.prototype.isFetching = function() {
				return this.fetchingProcess ? true : false;
			};

			return {
				asList: function(storageName, config) {
					return new Storage(storageName, config ? config : {}, 'list');
				},
				asEntity: function(storageName, config) {
					return new Storage(storageName, config ? config : {}, 'entity');
				}
			};

		});

})();
