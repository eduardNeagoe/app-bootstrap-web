bootstrapControllers.controller('LogoutController', ['$location', 'AuthenticationSharedService'
    ,function ($location, AuthenticationSharedService) {
    AuthenticationSharedService.logout();
    $location.path('/login');
}]);