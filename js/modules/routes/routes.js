app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('ca');

    var caState = {
        name: 'ca',
        url: '/ca',
        templateUrl: '/html/ca/index.html'
    };

    var analysisState = {
        name: 'analysis',
        url: '/analysis',
        templateUrl: '/html/analysis/index.html',
        resolve: {
            security: ['AuthService', '$q', function(AuthService, $q) {
                if (AuthService.isAuthenticated() &&  AuthService.getProfile() === "user") {
                    return $q.reject("Not Authorized");
                }
            }]
        }
    };

    var durabilityState = {
        name: 'durability',
        url: '/durability',
        templateUrl: '/html/durability/index.html',
        resolve: {
            security: ['AuthService', '$q', function(AuthService, $q) {
                if (AuthService.isAuthenticated() &&  AuthService.getProfile() === "user") {
                    return $q.reject("Not Authorized");
                }
            }]
        }
    };

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/html/admin/index.html',
        resolve: {
            security: ['AuthService', '$q', function(AuthService, $q) {
                if (AuthService.isAuthenticated() &&  AuthService.getProfile() === "user") {
                    return $q.reject("Not Authorized");
                }
            }]
        }
    };

    $stateProvider.state(caState);
    $stateProvider.state(analysisState);
    $stateProvider.state(durabilityState);
    $stateProvider.state(adminState);
});
