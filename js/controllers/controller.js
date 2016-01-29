//Add a controller
app.controller('WordSearchMakerCtrl', ['$scope', function($scope) {

  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  $scope.init = function() {
    $scope.width = 10;
    $scope.length = 10;
    $scope.words = [];
    $scope.selecting = false;
    $scope.guess = "";
    $scope.initGrids();
  };

  $scope.save = function(w, l) {
    $scope.width = w;
    $scope.length = l;
    $scope.initGrids();
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
      //TODO: some better indication that it's a duplicate
      console.log("Duplicate word: " + word);
    }
  }

  $scope.mouseDownLetter = function(row, col, item) {
    $scope.selecting = true;
    $('#item-' + row + '-' + col).css("border","2px solid red");
    $scope.guess += item;
  }

  $scope.mouseUpLetter = function(row, col) {
    $scope.selecting = false;
    //Check if the user has found a word in the list
    if($scope.words.indexOf($scope.guess) != -1) {
      //Cross the word off in the word list
      $('#' + $scope.guess).css("text-decoration", "line-through");
      $('#' + $scope.guess).css("text-decoration-color", "red");
      //TODO: Outline the word in GREEN
    } else {
      //Clear the selection
    }
    $scope.guess = '';
  }

  $scope.mouseEnterLetter = function(row, col, item) {
    //TODO: probably better to set it up so the border follows the mouse, and
    //then just check the start and end point to determine which letters
    //have been selected. Saves the trouble associated with backtracking, and
    //makes diagonals easier to handle.
    if($scope.selecting) {
      $('#item-' + row + '-' + col).css("border","2px solid red");
      $scope.guess += item;
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
        var currChar = $scope.answers[checkRow][checkCol];
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
          $scope.answers[row][col] = word.charAt(i);
          row += rowStep;
          col += colStep;
        }
        placed = true;
      }
    }
  };

  $scope.initGrids = function() {
    $scope.grid = [];
    $scope.answers = [];
    for (i = 0; i < $scope.width; i++) {
      var row1 = [];
      var row2 = [];
      for (j = 0; j < $scope.length; j++) {
        var rand = Math.floor(Math.random() * uppercase.length)
        row1.push(uppercase.charAt(rand));
        row2.push("-");
      }
      $scope.grid.push(row1);
      $scope.answers.push(row2);
    }
  };

}]);
