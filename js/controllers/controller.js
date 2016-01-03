//Add a controller
app.controller('WordSearchMakerCtrl', ['$scope', function($scope) {

  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  $scope.init = function() {
    $scope.width = 10;
    $scope.length = 10;
    $scope.words = [];
    $scope.initGrid();
    //$scope.fillGrid();
  };

  $scope.save = function(w, l) {
    $scope.width = w;
    $scope.length = l;
    $scope.initGrid();
    //TODO: re-insert words if we change size mid-way through
    if($scope.words.length > 0) {
      for (var i = 0; i < $scope.words.length; i++) {
        $scope.insertWord($scope.words[i]);
      }
    }
  };

  function getPossibleDirections(row, col, wordLength) {
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
    return directions;
  }

  $scope.addWord = function(word) {
    word = word.toUpperCase();
    if ($scope.words.indexOf(word) == -1) {
      $scope.words.push(word);
      $scope.insertWord(word);
    } else {
      //TODO: some indication that it's a duplicate
      console.log("Duplicate word: " + word);
    }
  }

  $scope.insertWord = function(word) {
    var wordLength = word.length;
    var placed = false;

    while (!placed) {
      var row = Math.floor(Math.random() * $scope.length);
      var col = Math.floor(Math.random() * $scope.width);
      //TODO: deal with collisions
      //TODO: handle directions better
      var directions = getPossibleDirections(row, col, wordLength);

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

      var collision = false;
      var checkRow = row;
      var checkCol = col;
      for (var i = 0; i < wordLength; i ++) {
        var currChar = $scope.grid[checkRow][checkCol];
        if (currChar != "-" && currChar != word.charAt(i)) {
          collision = true;
          break;
        }
        checkRow += rowStep;
        checkCol += colStep;
      }

      if (!collision) {
        for (var i = 0; i < wordLength; i ++) {
          $scope.grid[row][col] = word.charAt(i);
          row += rowStep;
          col += colStep;
        }
        placed = true;
      }
    }
    //$scope.fillGrid();
  };

  $scope.initGrid = function() {
    $scope.grid = [];
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
