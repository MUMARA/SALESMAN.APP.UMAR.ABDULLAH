angular.module('starter')
  .controller("signupCtrl", function ($rootScope, $scope, $http) {

    $scope.newUser = {};

    $scope.submit = function () {

      $http.post("/signup", $scope.newUser).then(function (response) {

        $rootScope.signUpMongoId = response.data.data;
       // console.log("signUpMongoId is response ", response," response.data ",response.data," response.data.data ",response.data.data);

      }, function myError(err) {
        console.log("admin signUp.js error " + err.statusText);
        $scope.displaySignup = err.statusText;

      });
    }
  });
