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
    controller: 'membersController',
      resolve: {
		memberList: function(aquentuxsocietyAPIfactory) {
			return aquentuxsocietyAPIfactory.getMembers();
		}
      }
  })
  .otherwise({redirectTo: '/members'});
}])

.controller('membersController',['$scope', 'memberList', function($scope, memberList, aquentuxsocietyAPIfactory) {
    $scope.nameFilter = null;
    $scope.memberList = memberList.data;
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
    

    $scope.getDetail = function(index){
      $scope.detail = $scope.memberList[index -1];
        //aquentuxsocietyAPIfactory.getDetail(index).success(function (response) {
        //Dig into the responde to get the relevant data
        //$scope.detail = response;
   // });
  };
    
  }])

.factory('aquentuxsocietyAPIfactory', function($http) {

    var urlBase = 'http://private-anon-0e04a959d-aquentuxsociety.apiary-mock.com/members';
    var aquentuxsocietyAPIservice = {
        
    getMembers : function() {
      var promise = $http({
        method: 'GET', 
        url: urlBase
      }).success(function(data, status, headers, config) {
				return data;
			});
    return promise;
    },
    getDetail : function(id) {
			var promise = $http({ method: 'GET', url: urlBase + '/' +id }).success(function(data, status, headers, config) {
				return data;
			});
			return promise;
		}
         
}
    return aquentuxsocietyAPIservice;
  });

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.run(['$rootScope', function($root) {

  $root.$on('$routeChangeStart', function(e, curr, prev) { 
    if (curr.$$route && curr.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $root.loadingView = true;
    }
  });

  $root.$on('$routeChangeSuccess', function(e, curr, prev) { 
    // Hide loading message
    $root.loadingView = false;
  });

}]);