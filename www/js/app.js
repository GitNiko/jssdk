angular.module('wxapp', ['ionic'])
    .config(['$stateProvider', '$urlRouterProvider',  function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('login', {
                url: "/login?r&rp",
                templateUrl: "templates/frontend/login.html",
                controller: 'LoginCtrl'
            })
    }]);
