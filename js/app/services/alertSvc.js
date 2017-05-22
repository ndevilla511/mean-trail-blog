app.service('alertSvc', ['$rootScope', '$timeout', function($rootScope, $timeout){
    $rootScope.alerts = [
    //    {
    //    type: 'success',
    //    msg: "Example success message."
    //},
    //{
    //    type: 'danger',
    //    msg: "Example danger message"
    //}
    ];
    this.addAlert = function(type, msg) {
        var newAlert = {
            type: type,
            msg: msg
        };

        $rootScope.alerts.push(newAlert);

        $timeout(function() {
            var index = $rootScope.alerts.indexOf(newAlert);
            $rootScope.alerts.splice(index, 1);
        }, 4000)
    }
}]);