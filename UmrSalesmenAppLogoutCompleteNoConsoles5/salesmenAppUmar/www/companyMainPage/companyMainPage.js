angular.module('starter')
  .controller("companyMainPageCtrl", function ($scope, $rootScope, $state, $location, $http) {

    $scope.salesman = {};

    $scope.add = function (salesman) {

      /*$rootScope.signUpMongoId come from signUp.js company admin signUp id of mongolab to populate data joint of admin $ salesman*/
      $scope.salesman.id = $rootScope.signUpMongoId;

      $http.post("/mobo/salesmanSignup", $scope.salesman).then(function (response) {


      })
    };

    $scope.show = function () {
      console.log('Compressed show button');
      $http.get('/mobo/getAllData').then(function (response) {
       $scope.showAllData =  response.data;
        console.log(showAllData,'showAllData from companyMainPage.js is');
      });
    };
    
    
    
    $scope.populate = function () {
      $http.get('/populate').then(function (response) {
        $scope.populateData =  response.data;
        console.log("response data is " ,response.data)
      });
      console.log("populate button");
    };






    $scope.logOut = function () {
      localStorage.removeItem("uid");
      $state.go('signIn');
    }
  });
