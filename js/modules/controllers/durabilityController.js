app.controller("durabilityController", ['$scope', '$http', function($scope, $http) {
    var baseUrl = "http://localhost:4567/";

    $scope.durabilities = [{
        "date": "27/10/2016",
        "equipment": "Luva cirúrgica",
        "material": "plástico seco",
        "days": "9999",
        "fileName": "algum.pdf"
    }, {
        "date": "29/11/2016",
        "equipment": "RESPIRADOR PURIFICADOR DE AR TIPO FILTRO QUÍMICO DE BAIXA CAPACIDADE",
        "material": "látex",
        "days": "45",
        "fileName": "algum_arquivo_baixado_da_internet_como_base_de_conhecimento.pdf"
    }];

    this.getEquipments = function() {
        $http({
            url: baseUrl + "equipment",
            method: "GET"
        }).success(function(data) {
            $scope.fetching = false;
            $scope.equipments = data;
        }).error(function() {
            $scope.error = "Aconteceu um erro!"
            $scope.fetching = false;
        });
    };

    this.getMaterials = function() {
        $http({
            url: baseUrl + "material",
            method: "GET"
        }).success(function(data) {
            $scope.fetching = false;
            $scope.materials = data;
        }).error(function() {
            $scope.error = "Aconteceu um erro!"
            $scope.fetching = false;
        });
    };

    this.orderBy = function(field) {
        $scope.orderCriteria = field;
        $scope.orderDirection = !$scope.orderDirection;
    };

    this.getEquipments();
    this.getMaterials();

}]);
