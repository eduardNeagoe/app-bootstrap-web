
bootstrapControllers.controller('SettingsController',['$scope', 'Account', 'User', function ($scope, Account, User) {
    $scope.success = null;
    $scope.error = null;
    $scope.settingsAccount = Account.get();
    $scope.settingsUser = User.get();

    $scope.save = function () {
        $scope.success = null;
        $scope.error = null;
        $scope.errorEmailExists = null;
        Account.updateCurrentAccount($scope.settingsAccount,
            function (value, responseHeaders) {
                $scope.error = null;
                $scope.success = 'OK';
                $scope.settingsAccount = Account.get();
            },
            function (httpResponse) {
                if (httpResponse.status === 400 && httpResponse.data === "e-mail address already in use") {
                    $scope.errorEmailExists = "ERROR";
                } else {
                    $scope.error = "ERROR";
                }
            });
    };
}]);
