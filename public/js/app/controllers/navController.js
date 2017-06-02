app.controller('navController', ['AuthSvc', 'alertSvc','$window', '$location', function(AuthSvc, alertSvc, $window, $location) {
    var vm = this;

    vm.logout = function() {
        delete $window.sessionStorage.token;
        AuthSvc.isLoggedIn = false;
        $location.path('/');
        alertSvc.addAlert('success', 'You have logged out!');
    };

    vm.isLoggedIn = function() {
        return AuthSvc.isLoggedIn;
    }

}]);