//Add a controller
app.controller('WordSearchMakerCtrl', ['$scope', function($scope) {

  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  $scope.init = function() {
    $scope.width = 10;
    $scope.length = 10;
    $scope.words = [];
    $scope.generateGrid();
  };

  $scope.save = function(w, l) {
    $scope.width = w;
    $scope.length = l;
    $scope.generateGrid();
  };

  $scope.addWord = function(word) {
    $scope.words.push(word.toUpperCase());
    console.log($scope);
  };

  $scope.generateGrid = function() {
    $scope.grid = [];
    for (i = 0; i < $scope.width; i++) {
      var row = []
      for (j = 0; j < $scope.length; j++) {
        var rand = Math.floor(Math.random() * uppercase.length)
        row.push(uppercase.charAt(rand));
      }
      $scope.grid.push(row);
    }
  };

}]);
