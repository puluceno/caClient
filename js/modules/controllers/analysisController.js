app.controller("analysisController", ['$scope', '$timeout', 'Http', function($scope, $timeout, Http) {

    var self = this;
    $scope.agents = [{}];
    $scope.deliveries = [{}];

    this.addAgents = function() {
        $scope.agents.push({});
    };

    this.removeAgents = function(index) {
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
    $scope.openDPVacationStart = [];
    $scope.openDPVacationEnd = [];
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

    this.openVacationStart = function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.openDPVacationStart[datePickerIndex] === true) {
            $scope.openDPVacationStart.length = 0;
        } else {
            $scope.openDPVacationStart.length = 0;
            $scope.openDPVacationStart[datePickerIndex] = true;
        }
    };

    this.openVacationEnd = function($event, datePickerIndex) {
        $event.preventDefault();
        $event.stopPropagation();
        if ($scope.openDPVacationEnd[datePickerIndex] === true) {
            $scope.openDPVacationEnd.length = 0;
        } else {
            $scope.openDPVacationEnd.length = 0;
            $scope.openDPVacationEnd[datePickerIndex] = true;
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

    this.getAgent = function() {
        Http.get("api/agent")
            .then(function successCallback(data) {
                $scope.agent = data;
            }, function errorCallback(data) {
                $scope.errorAgent = true;
                $scope.errorMsgAgent = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.errorAgent = false;
                }, 10000);
            })
    };

    $scope.addAgent = function(tag) {
        Http.post("api/agent", tag)
            .then(function successCallback(data) {
                if (data != null && data != "") {
                    $scope.agent = data;
                }
            }, function errorCallback(data) {
                $scope.errorAgent = true;
                $scope.errorMsgAgent = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.errorAgent = false;
                }, 10000);
            })
    }

    $scope.loadAgent = function($query) {
        var agent = $scope.agent;
        return agent.filter(function(agent) {
            return agent.text.indexOf($query.toLowerCase()) != -1;
        });
    };

    this.agentContains = function(index, word, word2) {
        if ($scope.agents[index].agent != undefined)
            return $scope.agents[index].agent.some(item => JSON.stringify(item) === JSON.stringify({
                'text': word
            })) || $scope.agents[index].agent.some(item => JSON.stringify(item) === JSON.stringify({
                'text': word2
            }));
    };

    this.getWorkingHours = function() {
        Http.get("api/workingHours")
            .then(function successCallback(data) {
                $scope.wHours = data;
            }, function errorCallback(data) {
                $scope.errorAgent = true;
                $scope.errorMsgAgent = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.errorAgent = false;
                }, 10000);
            })
    };

    this.clearVacations = function(index) {
        if (!$scope.showVacations) {
            $scope.agents[index].beginVacation = $scope.agents[index].endVacation = null;
        }
    }

    this.getEquipments = function() {
        Http.get("api/equipment")
            .then(function successCallback(data) {
                $scope.equipments = data;
            }, function errorCallback(data) {
                $scope.errorAgent = true;
                $scope.errorMsg = "Falha ao comunicar com o servidor."
                $timeout(function() {
                    $scope.error = false;
                }, 10000);
            })
    };

    this.getRelatedCA = function($index) {
        equipment = $scope.deliveries[$index].equipment
        $scope.fetching = true;
        Http.get("api/ca", {
                "equipment": equipment
            })
            .then(function successCallback(data) {
                data.splice(-1, 1);
                $scope.cas = data;
                $scope.fetching = false;
                $scope.success2 = true;
                $scope.successEquipment = "Há " + data.length + " CA para " + equipment + "."
                $timeout(function() {
                    $scope.success2 = false;
                }, 8000);
            }, function errorCallback(data) {
                $scope.errorMsgEquipment = "Falha ao comunicar com o servidor."
                $scope.fetching = false;
                $scope.errorEquipment = true;
                $timeout(function() {
                    $scope.errorEquipment = false;
                }, 8000);
            });
    };

    this.submitAnalysis = function() {
        $scope.analysing = true;
        if (this.isAnalysisFormValid()) {
            // this.verifyDates
            console.log(this.processDate($scope.cas[0].date));
            // var fd = new FormData();
            // fd.append("agents", angular.toJson($scope.agents));
            // fd.append("deliveries", angular.toJson($scope.deliveries));
            // Http.postFormData("api/analysis", fd)
            //     .then(function successCallback(data) {
            //         $scope.analysing = false;
            //         $scope.analysis = data;
            //     }, function errorCallback(data) {
            //         if (data.data === 'CA_EXPIRED_WHEN_DELIVERED')
            //             $scope.errorMsg = "O CA estava expirado quando o EPI foi entregue.";
            //         $scope.analysing = false;
            //         $scope.error = true;
            //         $timeout(function() {
            //             $scope.error = false;
            //         }, 8000);
            //     });
        }
        $scope.analysing = false;
    };

    this.processDate = function(date) {
        var parts = date.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    this.isAnalysisFormValid = function() {
        for (var i = 0; i < $scope.agents.length; i++) {
            if ($scope.agents[i].startDate > $scope.agents[i].endDate) {
                $scope.errorMsgAgent = "A data inicial é menor que a data final para o  " + (i + 1) + "º agente.";
                $scope.errorAgent = true;
                $timeout(function() {
                    $scope.errorAgent = false;
                }, 10000);
                return false;
            }
        };
        return true;
    };

    this.checkSelectCA = function(item, $index) {
        console.log("Item: " + item);
        $scope.cas.push(item);
        if (item.equipment != $scope.deliveries[$index].equipment) {
            $scope.errorMsgEquipment = "CA " + item.number + " possui equipamento diferente do informado. CA: " + item.equipment + ". Informado: " + $scope.deliveries[$index].equipment;
            $scope.errorEquipment = true;
            $timeout(function() {
                $scope.errorEquipment = false;
            }, 10000);
        }
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

    this.getAgent();
    this.getWorkingHours();
    this.getEquipments();

}]);

app.filter('minutesToDateTime', [function() {
    return function(minutes) {
        return new Date(1970, 0, 1).setMinutes(minutes);
    };
}])
