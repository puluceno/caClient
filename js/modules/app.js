    var app = angular.module("caApp", ['ngTagsInput', 'ui.bootstrap', 'ngFileUpload']).config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            'http://localhost:4567/*',
            'http://localhost:4567/durability',
            '*'
        ]);
    });

    app.config(function(tagsInputConfigProvider) {
        tagsInputConfigProvider.setDefaults('tagsInput', {
            placeholder: ''
        });
    });


    app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
