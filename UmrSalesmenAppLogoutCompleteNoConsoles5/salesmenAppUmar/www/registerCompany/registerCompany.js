angular.module('starter')
  .controller("registerCompanyCtrl", function ($rootScope, $scope, $http, $state, $location) {
    $scope.admin = {};
    $scope.registerCompany = function (admin) {
     
      $http.post("/registerCompany",
        {
          companyName: $scope.admin.companyName,
          companyAddress: $scope.admin.companyAddress,
          companyPhone: $scope.admin.companyPhone,
          firebaseUid: localStorage.getItem("uid")


        }).then(function (response) {
        $scope.displayAdmin = response.data;
        console.log("we see company run or not  ",response.data);
        $rootScope.registerAdmin = response.data;
        $state.go('companyMainPage')
      })
    };
    $scope.logOut = function () {
      localStorage.removeItem("uid");
      $state.go('signIn');
      // localStorage.removeItem("token");
    }
  });

