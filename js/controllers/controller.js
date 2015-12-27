//Add a controller
app.controller('WordSearchMakerCtrl', ['$scope', function($scope) {

  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  $scope.init = function() {
    $scope.width = 10;
    $scope.length = 10;
    $scope.words = [];
    $scope.grid = [];
    $scope.initGrid();
    $scope.fillGrid();
  };

  $scope.save = function(w, l) {
    $scope.width = w;
    $scope.length = l;
    //$scope.initGrid();
    //TODO: re-insert words if we change size mid-way through
  };

  $scope.addWord = function(word) {
    word = word.toUpperCase();
    var wordLength = word.length;
    var row = Math.floor(Math.random() * $scope.length);
    var col = Math.floor(Math.random() * $scope.width);
    //TODO: deal with collisions
    //TODO: handle directions better
    var directions = [];
    if ((row + wordLength) < $scope.length) {
      directions.push("down");
    }
    if ((row - wordLength) > 0) {
      directions.push("up");
    }
    if ((col + wordLength) < $scope.width) {
      directions.push("right");
      if(directions.indexOf("down") != -1) {
        directions.push("diag-down-right");
      }
      if(directions.indexOf("up") != -1) {
        directions.push("diag-up-right");
      }
    }
    if ((col - wordLength) > 0) {
      directions.push("left");
      if(directions.indexOf("down") != -1) {
        directions.push("diag-down-left");
      }
      if(directions.indexOf("up") != -1) {
        directions.push("diag-up-left");
      }
    }

    var dirPos = Math.floor(Math.random() * directions.length);
    var dir = directions[dirPos];
    var rowStep = 1;
    var colStep = 1;
    if (dir == "up") {
      rowStep = -1;
      colStep = 0;
    } else if (dir == "down") {
      colStep = 0;
    } else if (dir == "left") {
      colStep = -1;
      rowStep = 0;
    } else if (dir == "right") {
      rowStep = 0;
    } else if (dir == "diag-up-left") {
      rowStep = -1;
      colStep = -1;
    } else if (dir == "diag-up-right") {
      rowStep = -1;
    } else if (dir == "diag-down-left") {
      colStep = -1;
    } else if (dir == "diag-down-right") {
      //good with the defaults
    }

    for (var i = 0; i < wordLength; i ++) {
      $scope.grid[row][col] = word.charAt(i);
      row += rowStep;
      col += colStep;
    }

    $scope.words.push(word);
    $scope.fillGrid();
  };

  $scope.initGrid = function() {
    for (i = 0; i < $scope.width; i++) {
      var row = []
      for (j = 0; j < $scope.length; j++) {
        row.push("-");
      }
      $scope.grid.push(row);
    }
  };

  $scope.fillGrid = function() {
    for (i = 0; i < $scope.width; i++) {
      for (j = 0; j < $scope.length; j++) {
        if ($scope.grid[i][j] == "-") {
          var rand = Math.floor(Math.random() * uppercase.length)
          $scope.grid[i][j] = uppercase.charAt(rand);
        }
      }
    }
  };

}]);
