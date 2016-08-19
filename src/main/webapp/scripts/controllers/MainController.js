bootstrapControllers.controller('MainController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $http.get('ou/ou.json').then(
        function () {
            $rootScope.displayOUs = true;
        },
        function () {
            $rootScope.displayOUs = false;
        }
    );
    $location.path('/login');
}]);