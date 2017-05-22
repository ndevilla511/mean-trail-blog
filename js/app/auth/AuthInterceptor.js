app.service('AuthInterceptor', ['$location','$window', '$q', '$injector','AuthSvc', function($location, $window, $q, $injector, AuthSvc) {

    this.request = function(config) {
        if (config.headers === undefined) {
            config.headers = {};
        }

        if($window.sessionStorage.token) {
            config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
        }
        return config
    };

    this.response = function(response) {
        if (response.status === 200 && $window.sessionStorage.token && !AuthSvc.isLoggedIn) {
            AuthSvc.isLoggedIn = true;
        }
        if (response.status === 401) {
            AuthSvc.isLoggedIn = false;
        }
        return response || $q.when(response);
    };

    this.responseError = function(rejection) {
        if (rejection.status === 401 || rejection.status === 403) {
            delete $window.sessionStorage.token;
            AuthSvc.isLoggedIn = false;
            if($injector.get('$state').current.name !== 'login') {
                $location.path('/')
            }
        }
        return $q.reject(rejection);
    };

}]);