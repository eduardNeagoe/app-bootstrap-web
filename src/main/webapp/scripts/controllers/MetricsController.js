
bootstrapApp.controller('MetricsController',['$scope', 'MetricsService', 'HealthCheckService', 'ThreadDumpService',
    function ($scope, MetricsService, HealthCheckService, ThreadDumpService) {
    $scope.metrics = {};
    $scope.updatingMetrics = true;

    $scope.refresh = function () {
        $scope.updatingMetrics = true;
        MetricsService.get().then(function (promise) {
            $scope.metrics = promise;
            $scope.updatingMetrics = false;
        }, function (promise) {
            $scope.metrics = promise.data;
            $scope.updatingMetrics = false;
        });
    };

    $scope.$watch('metrics', function (newValue, oldValue) {
        $scope.servicesStats = {};
        $scope.cachesStats = {};
        angular.forEach(newValue.timers, function (value, key) {
            if (key.indexOf("web.rest") != -1 || key.indexOf("service") != -1) {
                $scope.servicesStats[key] = value;
            }

            if (key.indexOf("net.sf.ehcache.Cache") != -1) {
                // remove gets or puts
                var index = key.lastIndexOf(".");
                var newKey = key.substr(0, index);

                // Keep the name of the domain
                index = newKey.lastIndexOf(".");
                $scope.cachesStats[newKey] = {
                    'name': newKey.substr(index + 1),
                    'value': value
                };
            }
            ;
        });
    });

    $scope.refresh();

    $scope.refreshThreadDumpData = function () {
        ThreadDumpService.dump().then(function (data) {
            $scope.threadDump = data;

            $scope.threadDumpRunnable = 0;
            $scope.threadDumpWaiting = 0;
            $scope.threadDumpTimedWaiting = 0;
            $scope.threadDumpBlocked = 0;

            angular.forEach(data, function (value, key) {
                if (value.threadState == 'RUNNABLE') {
                    $scope.threadDumpRunnable += 1;
                } else if (value.threadState == 'WAITING') {
                    $scope.threadDumpWaiting += 1;
                } else if (value.threadState == 'TIMED_WAITING') {
                    $scope.threadDumpTimedWaiting += 1;
                } else if (value.threadState == 'BLOCKED') {
                    $scope.threadDumpBlocked += 1;
                }
            });

            $scope.threadDumpAll = $scope.threadDumpRunnable + $scope.threadDumpWaiting +
                $scope.threadDumpTimedWaiting + $scope.threadDumpBlocked;

        });
    };

    $scope.getLabelClass = function (threadState) {
        if (threadState == 'RUNNABLE') {
            return "label-success";
        } else if (threadState == 'WAITING') {
            return "label-info";
        } else if (threadState == 'TIMED_WAITING') {
            return "label-warning";
        } else if (threadState == 'BLOCKED') {
            return "label-danger";
        }
    };
}]);