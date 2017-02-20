app.controller("analysisController", ['$scope', '$http', function($scope, $http) {

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

}]);
