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
        templateUrl: '/html/analysis/index.html'
    };

    var durabilityState = {
        name: 'durability',
        url: '/durability',
        templateUrl: '/html/durability/index.html'
    };

    var adminState = {
        name: 'admin',
        url: '/admin',
        templateUrl: '/html/admin/index.html',
        resolve: {
            security: ['AuthService', '$q', function(AuthService, $q) {
                if (AuthService.isAuthenticated() &&  AuthService.getProfile() != "admin") {
                    return $q.reject("Not Authorized");
                }
            }]
        }
    };

    var userState = {
        name: 'users',
        url: '/admin/users',
        templateUrl: '/html/admin/users/index.html'
    };

    $stateProvider.state(caState);
    $stateProvider.state(analysisState);
    $stateProvider.state(durabilityState);
    $stateProvider.state(adminState);
    $stateProvider.state(userState);
});
