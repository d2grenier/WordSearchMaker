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
    //based on (row, col), figure out which directions we can go and pick one
    //TODO: deal with collisions
    //TODO: diagonal words
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
    }
    if ((col - wordLength) > 0) {
      directions.push("left");
    }
    var dirPos = Math.floor(Math.random() * directions.length);
    var dir = directions[dirPos];
    console.log("Putting " + word + " at (" + row + ", " + col + "), going " + dir);
    var endRow = row;
    var endCol = col;
    var step = 1;
    if (dir == "up") {
      step = -1;
      endRow = row - wordLength;
    } else if (dir == "down") {
      endRow = row + wordLength;
    } else if (dir == "left") {
      step = -1;
      endCol = col - wordLength;
    } else if (dir == "right") {
      endCol = col + wordLength;
    }

    if (dir == "up" || dir == "down") {
      var i = 0;
      while(row != endRow) {
        $scope.grid[row][col] = word.charAt(i);
        row += step;
        i++;
      }
    } else if(dir == "left" || dir == "right") {
      var i = 0;
      while(col != endCol) {
        $scope.grid[row][col] = word.charAt(i);
        col += step;
        i++;
      }
    }

    $scope.words.push(word);
    $scope.fillGrid();
    console.log($scope);
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
