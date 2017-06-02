app.controller('loginController', ['$http', '$location', '$window','AuthSvc', 'alertSvc', function($http, $location, $window, AuthSvc, alertSvc) {
    var vm = this;

    vm.login = function() {
        if(vm.username && vm.password) {
            var user = {
                username: vm.username,
                password: vm.password
            };

            console.log(angular.toJson(user));
            $http.post('/api/users/login', angular.toJson(user)).then(function(response) {
                if(response.data.success) {
                    $window.sessionStorage.token = response.data.token;
                    AuthSvc.isLoggedIn = true;
                    $location.path('/');
                    alertSvc.addAlert('success', 'Logged in!');
                }
            }).catch(function(error) {
                console.log(error);
                alertSvc.addAlert('danger', 'Username and/or password is incorrect.')
            })
        }
    };

}]);