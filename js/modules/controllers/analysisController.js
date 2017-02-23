app.controller("analysisController", ['$scope', '$timeout', 'Http', function($scope, $timeout, Http) {

    $scope.agents = [{}];
    $scope.deliveries = [{}];

    this.addAgent = function() {
        $scope.agents.push({});
    };

    this.removeAgent = function(index) {
        if ($scope.agents.length > 1)
            $scope.agents.splice(index, 1);
    };

    this.addDelivery = function() {
        $scope.deliveries.push({});
    };

    this.removeDelivery = function(index) {
        if ($scope.deliveries.length > 1)
            $scope.deliveries.splice(index, 1);
    };

    $scope.dateOptions = {
        format: 'dd/MM/yyyy',
        showWeeks: false
    };

    $scope.openDPStart = [];
    $scope.openDPEnd = [];
    $scope.openDPDelivery = [];

    this.openStart = function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.openDPStart[datePickerIndex] === true) {
            $scope.openDPStart.length = 0;
        } else {
            $scope.openDPStart.length = 0;
            $scope.openDPStart[datePickerIndex] = true;
        }
    };

    this.openEnd = function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.openDPEnd[datePickerIndex] === true) {
            $scope.openDPEnd.length = 0;
        } else {
            $scope.openDPEnd.length = 0;
            $scope.openDPEnd[datePickerIndex] = true;
        }
    };

    this.openDelivery = function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.openDPDelivery[datePickerIndex] === true) {
            $scope.openDPDelivery.length = 0;
        } else {
            $scope.openDPDelivery.length = 0;
            $scope.openDPDelivery[datePickerIndex] = true;
        }
    };

    this.getEquipments = function() {
        Http.get("api/equipment")
            .then(function successCallback(data) {
                $scope.equipments = data;
            }, function errorCallback(data) {
                $scope.error = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 10000);
            })
    };

    this.getRelatedCA = function(equipment) {
        $scope.fetching = true;
        Http.get("api/ca", {
                "equipment": equipment
            })
            .then(function successCallback(data) {
                data.splice(-1, 1);
                $scope.cas = data;
                $scope.fetching = false;
                $scope.success = true;
                $scope.successMsg2 = "Há " + data.length + " CA para " + equipment + "."
                $timeout(function() {
                    $scope.success = false;
                }, 6000);
            }, function errorCallback(data) {
                $scope.errorMsg2 = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 6000);
            });
    };

    this.submitAnalysis = function() {
        $scope.analysing = true;
        if (this.isAnalysisFormValid()) {
            var fd = new FormData();
            fd.append("agents", angular.toJson($scope.agents));
            fd.append("deliveries", angular.toJson($scope.deliveries));
            Http.postFormData("api/analysis", fd)
                .then(function successCallback(data) {
                    $scope.analysing = false;
                    $scope.analysis = data;
                }, function errorCallback(data) {
                    if (data.data === 'CA_EXPIRED_WHEN_DELIVERED')
                        $scope.errorMsg = "O CA estava expirado quando o EPI foi entregue.";
                    $scope.analysing = false;
                    $scope.error = true;
                    $timeout(function() {
                        $scope.error = false;
                    }, 8000);
                });
        }
        $scope.analysing = false;
    };

    this.isAnalysisFormValid = function() {
        for (var i = 0; i < $scope.agents.length; i++) {
            if ($scope.agents[i].startDate > $scope.agents[i].endDate) {
                $scope.errorMsgAgent = "A data inicial é menor que a data final para o  " + (i + 1) + "º agente.";
                $scope.errorAgent = true;
                $timeout(function() {
                    $scope.errorAgent = false;
                }, 7000);
                return false;
            }
        };
        return true;
    };




    /*GRAPH TEST*/
    $scope.labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"];
    $scope.series = ['Ácido Sulfúrico', 'Barulho'];
    $scope.data = [
        [1, 0, 0, 1, 1, 1, 1]
    ];

    $scope.datasetOverride = [{
        yAxisID: 'Proteção'
    }, {
        yAxisID: 'Dias'
    }];
    $scope.options = {
        scales: {
            yAxes: [{
                id: 'Proteção',
                type: 'linear',
                lineTension: 0,
                display: false,
                position: 'left',
                ticks: {
                    mix: 0,
                    max: 1.1,
                    stepSize: 1
                }
            }]
        },
        elements: {
            line: {
                tension: 0
            }
        }
    };

    this.getEquipments();

}]);
