var App = angular.module('littracker', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/rankings');

    $stateProvider
      .state('rankings', {
        url: '/rankings',
        templateUrl: '../partials/rankings.html'
      })
      .state('about-littracker', {
        url: '/about',
        templateUrl: '../partials/about-littracker.html'
      })
      .state('add', {
        url: '/new',
        templateUrl: '../partials/add-book-form.html'
      })
      .state('search', {
        url: '/search',
        templateUrl: '../partials/search.html'
      })
  });