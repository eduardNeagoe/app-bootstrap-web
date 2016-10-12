bootstrapControllers.controller('LoginController', ['$scope', '$location', 'AuthenticationSharedService', '$rootScope',
    function ($scope, $location, AuthenticationSharedService, $rootScope) {
    	$rootScope.loginContentHeight = 55;
        $scope.rememberMe = false;
        $scope.login = function () {
            AuthenticationSharedService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe,
                extraDetails: $scope.extraDetails
            });
        }
    }]);
