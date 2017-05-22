'use strict';
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angularMoment','angular-jwt']);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');
    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })
        .state({
            name: 'about',
            url: '/about',
            templateUrl: 'views/about.html'
        })
        .state({
            name: 'contact',
            url: '/contact',
            templateUrl: 'views/contact.html'
        })
        .state({
            name: 'login',
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginController',
            controllerAs: 'loginCtrl'
        })
        .state({
            name: 'post',
            url: '/post/:blogpostId',
            templateUrl: 'views/post.html',
            controller: 'postController',
            controllerAs: 'postCtrl'
        })
        .state({
            name: 'addNewPost',
            url:'/addNewPost',
            templateUrl: 'views/addNewPost.html',
            controller: 'addNewPostController',
            controllerAs: 'addNewPostCtrl',
            access: {
                restricted: true
            }
        });

}]);

app.run(['$rootScope', '$location', '$window', 'AuthSvc', function($rootScope, $location, $window, AuthSvc) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if (nextRoute.access !== undefined && nextRoute.access.restricted && !window.sessionStorage.token && !AuthSvc.isLoggedIn) {
            event.preventDefault();
            $location.path('/');
        }
    })
}]);

