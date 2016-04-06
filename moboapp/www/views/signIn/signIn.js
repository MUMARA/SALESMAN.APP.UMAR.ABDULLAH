var app = angular.module('starter');
app.controller("signInCtrl", function ($scope, $http, $rootScope, $state, $ionicPopup) {

  // var ref = new Firebase("https://umrsalesman.firebaseio.com");

  $scope.signIn = {};
  //console.log($rootScope.url);

  $scope.doSignin = function () {
    //console.log($scope.signIn);
    //console.log('email is ', $scope.signIn.email, ' & password is', $scope.signIn.password);



    /* $rootScope.url = "http://localhost:3000";  in moboapp  in app.js*/
    $http.post("http://localhost:3000/mobo/signIn", { "email": $scope.signIn.email,  "password": $scope.signIn.password}).then(function (response) {
      $rootScope.salemanMongoIdWithRootScope = response.data.record;

      // console.log("saleman signIn.js success  " , response.data, 'response.data.id is ',response.data.record);
    });


  }, function myError(err) {
    console.log("saleman signIn.js err is " + err.statusText);}
})


