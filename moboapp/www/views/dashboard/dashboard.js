var app = angular.module("starter");
app.controller("dashboardCtrl", function ($scope, $http,$rootScope) {


  $scope.placeOrder = function (newOrder) {

    $http.post("http://localhost:3000/mobo/dashboard", {
      orderTitle: newOrder.title,
      orderText: newOrder.text,
      salemanMongoId: $rootScope.salemanMongoIdWithRootScope


    }).then(function (succ) {
     // console.log('dashboard.js succ ', succ);
    }, function (err) {
      console.log('dashboard.js err ', err);
    });
  }


});
