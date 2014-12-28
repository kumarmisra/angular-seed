'use strict';

// Declare app level module which depends on views, and components
var app=angular.module('MyUxApp', [
  'myApp.version',
    'ngRoute'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/members', {
    templateUrl: 'view1/view1.html',
    controller: 'membersController'
  })
  .otherwise({redirectTo: '/members'});
}])

.controller('membersController', function($scope, aquentuxsocietyAPIfactory) {
    $scope.nameFilter = null;
    $scope.memberList = [];
    $scope.detail = [];
    $scope.pageSize = 10;
    $scope.currentPage = 0;
    
      $scope.numberOfPages=function(){
        return Math.ceil($scope.memberList.length/$scope.pageSize);                
    }
    
    $scope.searchFilter = function (member) {
    var keyword = new RegExp($scope.nameFilter, 'i');
    return !$scope.nameFilter || keyword.test(member.firstName);
};
    
    

    aquentuxsocietyAPIfactory.getMembers().success(function (response) {
        //Dig into the responde to get the relevant data
        $scope.memberList = response;
    });
    
    $scope.getDetail = function(index){
      $scope.detail = $scope.memberList[index -1];
        //aquentuxsocietyAPIfactory.getDetail(index).success(function (response) {
        //Dig into the responde to get the relevant data
        //$scope.detail = response;
   // });
  };
    
  })

.factory('aquentuxsocietyAPIfactory', function($http) {

    var urlBase = 'http://private-anon-0e04a959d-aquentuxsociety.apiary-mock.com/members';
    var aquentuxsocietyAPIservice = {};
    

    aquentuxsocietyAPIservice.getMembers = function() {
      return $http({
        method: 'GET', 
        url: urlBase
      });
    }
    
    aquentuxsocietyAPIservice.getDetail = function(id) {
      return $http({
        method: 'GET', 
        url: urlBase + '/' +id
      });
    }

    return aquentuxsocietyAPIservice;
  });

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});