bootstrapServices.factory('AuthenticationSharedService',['$rootScope', '$http', 'authService', 'Session', 'Account', 'Permissions',
    function ($rootScope, $http, authService, Session, Account, Permissions) {
    return {
        login: function (param) {
            var data ="j_username=" + encodeURIComponent(param.username) +"&j_password=" +
                encodeURIComponent(param.password) +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
            $http.post('app/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function (data, status, headers, config) {
                Account.get(function(data) {
                    Session.create(data.login, data.firstName, data.lastName, data.email, data.roles,data.gender, data.moduleRights);
                    $rootScope.account = Session;
                    Permissions.refreshAdminModules();
                    authService.loginConfirmed(data);
                });


            }).error(function (data, status, headers, config) {
                $rootScope.authenticationError = true;
                Session.invalidate();
            });
        },
        valid: function (authorizationData) {
                $http.get('protected/authentication_check.gif', {
                    ignoreAuthModule: 'ignoreAuthModule'
                }).success(function (data, status, headers, config) {
                    if (!Session.login) {
                        Account.get(function (data) {
                            Session.create(data.login, data.firstName, data.lastName, data.email, data.roles, data.gender, data.moduleRights);
                            $rootScope.account = Session;
                            if (!$rootScope.isAuthorized(authorizationData)) {
                                // user is not allowed
                                $rootScope.$broadcast("event:auth-notAuthorized");
                            } else {
                                $rootScope.$broadcast("event:auth-loginConfirmed");
                                $rootScope.$broadcast("event:get-account-information", data);
                            }
                        });
                    } else {
                        if (!$rootScope.isAuthorized(authorizationData)) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                            $rootScope.$broadcast("event:auth-loginConfirmed");
                        }
                    }
                }).error(function (data, status, headers, config) {
                    if (!$rootScope.isAuthorized(authorizationData)) {
                        $rootScope.$broadcast('event:auth-loginRequired', data);
                    }
                });
            },
            isAuthorized: function (authorizationData) {
                //check Module access
                if (!angular.isArray(authorizationData)) {
                    if (authorizationData == '*') {
                        return true;
                    }

                    authorizationData = [authorizationData];
                }

                var isAuthorized = false;
                angular.forEach(authorizationData, function (authorizedModule) {
                    var authorized = false;
                    if (!!Session.login) {
                        angular.forEach(Session.moduleRights, function (moduleRights) {
                            if (angular.equals(moduleRights.module.code, authorizedModule)) {
                                authorized = true;
                            }
                        });
                    }
                    if (authorized || authorizedModule == '*') {
                        isAuthorized = true;
                    }
                });

                return isAuthorized;
            },
            isInRoles: function (roles) {
                var isInRoles=false;
                angular.forEach(roles, function (role) {

                    if (!!Session.login) {

                        angular.forEach(Session.userRoles, function (role_) {
                            if (angular.equals(role_.code, role)) {
                                isInRoles=isInRoles|| true;
                            }
                        });
                    }

                });
                return isInRoles;
            },
            logout: function () {
                $rootScope.authenticationError = false;
                $rootScope.authenticated = false;
                $rootScope.account = null;

                $http.get('app/logout');
                Session.invalidate();
                authService.loginCancelled();
            }
        };
    }]);
