app.controller("footerController", ['$scope', 'Http', '$timeout', '$uibModal', function($scope, Http, $timeout, $uibModal) {
	var self = this;
	// var downloadUrl = 'http://localhost:8000/';
	var downloadUrl = "http://52.67.252.0/";

	this.getParams = function() {
		Http.get("api/params")
			.then(function successCallback(data) {
				$scope.fileUrl = data.fileUrl;
				$scope.lastUpdated = data.lastUpdated;
				$scope.fetching = false;
			}, function errorCallback(data) {
				$scope.error = true;
				$scope.errorMsgFooter = "Falha ao comunicar com o servidor."
				$scope.fetching = false;
				$timeout(function() {
					$scope.error = false;
				}, 15000);
			})
	};

	this.getCount = function() {
		Http.get("api/ca/count")
			.then(function successCallback(data) {
				$scope.caCount = data;
				$scope.fetching = false;
			}, function errorCallback(data) {
				$scope.error = true;
				$scope.errorMsgFooter = "Falha ao comunicar com o servidor."
				$scope.fetching = false;
				$timeout(function() {
					$scope.error = false;
				}, 15000);
			})
	};

	this.getParams();
	this.getCount();

	this.updateFileUrl = function() {
		$scope.fileUrlUpdating = true;
		Http.post("api/fileUrl", $scope.fileUrl)
			.then(function successCallback(data) {
				$scope.fileUrl = data.fileUrl;
				$scope.lastUpdated = data.lastUpdated;
				$scope.success = true;
				$scope.fileUrlUpdating = false;
				$scope.successMsgFooter = "Endereço atualizado!"
				$timeout(function() {
					$scope.success = false;
				}, 15000);
			}, function errorCallback(data) {
				$scope.error = true;
				$scope.fileUrlUpdating = false;
				$scope.errorMsgFooter = "Falha ao comunicar com o servidor."
				$timeout(function() {
					$scope.error = false;
				}, 15000);
			})
	};

	this.updateDatabase = function() {
		$scope.databaseUpdating = true;
		Http.post("api/updateDatabase")
			.then(function successCallback(data) {
				$scope.lastUpdated = data.lastUpdated;
				$scope.success = true;
				$scope.databaseUpdating = false;
				$scope.successMsgFooter = data.updateCount + " CA adicionados ao sistema.";
				$timeout(function() {
					$scope.success = false;
				}, 15000);
			}, function errorCallback(data) {
				$scope.error = true;
				$scope.databaseUpdating = false;
				$scope.errorMsgFooter = "Falha ao comunicar com o servidor."
				$timeout(function() {
					$scope.error = false;
				}, 15000);
			})
	};

	this.uploadCA = function() {
		$scope.uploadingCA = true;
		$timeout(function() {
			$scope.fileUrlUpdatedSucess = false;
			var file = $scope.newCA;
			var fd = new FormData();
			fd.append('newCA', file);
			Http.postFormData("api/ca", fd)
				.then(function successCallback(data) {
					$scope.successMsgFooter = data;
					$scope.uploadingCA = false;
					$scope.success = true;
					angular.element(document.querySelector('#uploadCAFile')).val("");
					$timeout(function() {
						$scope.success = false;
					}, 15000);
				}, function errorCallback(data) {
					$scope.errorMsgFooter = data;
					$scope.uploadingCA = false;
					$scope.error = true;
					angular.element(document.querySelector('#uploadCAFile')).val("");
					$timeout(function() {
						$scope.error = false;
					}, 15000);
				});
			file = null;
			fd = null;
		}, 1000);
	};

	$scope.formCA = {};
	$scope.reports = [{}];
	$scope.technicalRules = [{}];
	$scope.frequencies = ["125", "250", "500", "1000", "2000", "3150", "4000", "6300", "8000", "NRRsf"];
	$scope.formCA.attenuationTable = {
		"frequencies": [125, 250, 500, 1000, 2000, 3150, 4000, 6300, 8000, "NRRsf"],
		"dbAttenuations": new Array(10),
		"deviations": new Array(10)
	};

	this.addReportField = function() {
		$scope.reports.push({});
	};

	this.removeReportField = function(index) {
		$scope.reports.splice(index, 1);
	};

	this.addRuleField = function() {
		$scope.technicalRules.push({});
	};

	this.removeRuleField = function(index) {
		$scope.technicalRules.splice(index, 1);
	};

	this.clearForm = function() {
		$scope.formCA = {};
		$scope.formCA.file = {};
		$scope.reports = [{}];
		$scope.technicalRules = [{}];
		$scope.frequencies = ["125", "250", "500", "1000", "2000", "3150", "4000", "6300", "8000", "NRRsf"];
		$scope.formCA.attenuationTable = {
			"frequencies": [125, 250, 500, 1000, 2000, 3150, 4000, 6300, 8000, "NRRsf"],
			"dbAttenuations": new Array(10),
			"deviations": new Array(10)
		};
		$scope.createCAForm.$setPristine();
	};

	this.getScope = function() {
		return $scope;
	};

	this.submitFormCA = function(file) {
		$scope.creatingFormCA = true;
		$scope.formCA.reports = [];
		$scope.formCA.reports.push(...$scope.reports);
		$scope.formCA.technicalRules = [];
		$scope.formCA.technicalRules.push(...$scope.technicalRules);
		$timeout(function() {
			var file = $scope.formCA.file
			var fd = new FormData();
			fd.append("file", file);
			fd.append("data", angular.toJson($scope.formCA));

			Http.postFormData("api/caform", fd)
				.then(function successCallback(data) {
					$scope.creatingFormCA = false;
					$scope.success = true;
					$scope.successMsgFooter = data;
					self.getCount();
					if ($scope.successMsgFooter.includes("sucesso")) {
						self.clearForm();
					}
					$timeout(function() {
						$scope.success = false;
					}, 15000);
				}, function errorCallback(data) {
					$scope.creatingFormCA = false;
					$scope.error = true;
					$scope.errorMsgFooter = data == null ? "Falha ao comunicar com o servidor." : data;
					$timeout(function() {
						$scope.error = false;
					}, 15000);
				});
			angular.element(document.querySelector('#dialogInsertCA')).modal('hide');
		}, 1000);
	};

	this.uploadCAFormFile = function() {
		$scope.creatingFormCA = true;
		$timeout(function() {
			var file = $scope.formCA.file
			var fd = new FormData();
			fd.append("file", file);

			Http.postFormData("api/caformfile", fd)
				.then(function successCallback(data) {
					$scope.formCA = data;
					if ($scope.formCA.attenuationTable == undefined) {
						$scope.formCA.attenuationTable = {
							"frequencies": [125, 250, 500, 1000, 2000, 3150, 4000, 6300, 8000, "NRRsf"],
							"dbAttenuations": new Array(10),
							"deviations": new Array(10)
						};
					}
					$scope.formCA.file = file;
					$scope.formCA.number = parseInt(data.number);
					$scope.creatingFormCA = false;
					$scope.success = true;
					angular.element(document.querySelector('#uploadCAFormFile')).val("");
					$timeout(function() {
						$scope.success = false;
					}, 15000);
				}, function errorCallback(data) {
					$scope.creatingFormCA = false;
					$scope.error = true;
					$scope.errorMsgFooter = data == null ? "Falha ao comunicar com o servidor." : data;
					angular.element(document.querySelector('#uploadCAFormFile')).val("");
					$timeout(function() {
						$scope.error = false;
					}, 15000);
				});
		}, 1000);
	};

	this.generateBackup = function() {
		$scope.backingUp = true;
		Http.get("api/backup")
			.then(function successCallback(data) {
				$scope.backingUp = false;
				$scope.backupReady = true;
				$scope.backupFile = downloadUrl + data;
				console.log($scope.backupFile);
			}, function errorCallback(data) {
				$scope.error = true;
				$scope.backingUp = false;
			})
	};

	this.getBackup = function() {
		return $scope.backupFile;
	};

}]);
