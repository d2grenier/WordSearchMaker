//Add a controller
app.controller('WordSearchMakerCtrl', ['$scope', function($scope) {

  var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var letterWidth = 29;
  var letterHeight = 34;
  var diagonalLetterHeight = 31;
  var diagonalLetterWidth = 44;

  $scope.init = function() {
    $scope.width = 10;
    $scope.length = 10;
    $scope.word = "";
    $scope.words = [];
    $scope.foundWords = [];
    $scope.selecting = false;
    $scope.start = [];
    $scope.end = [];
    $scope.current = [];
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

  function getLetter(r, c) {
    return $('#item-' + r + '-' + c);
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
  };

  $scope.handleKeyPress = function(event) {
    if (event.which === 13) {
      $scope.addWord();
    }
  };

  $scope.addWord = function() {
    $scope.word = $scope.word.toUpperCase();
    if ($scope.words.indexOf($scope.word) == -1) {
      $scope.words.push($scope.word);
      $scope.insertWord($scope.word);
    } else {
      alert($scope.word + " is already in your word list.");
    }
    $scope.word = "";
  };

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

  $scope.mouseDownLetter = function(row, col, item) {
    $scope.selecting = true;
    $scope.start = { row: row, col: col};
    var pos = getLetter(row, col).position();
    $('#selection').css({
       left:  pos.left - 5,
       top:   pos.top
    });
    $('#selection').show();
  };

  $scope.mouseUpLetter = function(row, col) {
    $scope.selecting = false;
    $scope.end = { row: row, col: col};
    var guess = calculateGuess();
    checkGuess(guess);
    resetSelection();
  };

  $scope.mouseEnterLetter = function(row, col, item) {
    if($scope.selecting) {
      $scope.current = { row: row, col: col};
      //Horizontal
      if($scope.start.row == $scope.current.row && $scope.start.col != $scope.current.col) {
        rotateSelection('none', 'none');
        var diff = $scope.current.col - $scope.start.col;
        $('#selection').width((Math.abs(diff) + 1) * letterWidth);
        if (diff < 0) {
          var leftPos = $('#selection').position().left;
          $('#selection').css({
            left:  leftPos - letterWidth,
          });
        }
      } else if ($scope.start.row != $scope.current.row && $scope.start.col == $scope.current.col) { //Vertical
        rotateSelection('none', 'none');
        var diff = $scope.current.row - $scope.start.row;
        $('#selection').height((Math.abs(diff) + 1) * letterHeight);
        if (diff < 0) {
          var topPos = $('#selection').position().top;
          $('#selection').css({
            top:  topPos - letterHeight,
          });
        }
      } else { //Diagonal
        if($scope.start.row < $scope.current.row) { //Down
          var colDiff = $scope.current.col - $scope.start.col;
          //Adjust the width and height
          $('#selection').css({
            width:    (Math.abs(colDiff) + 1) * diagonalLetterWidth,
            height:   diagonalLetterHeight
          });
          //Calculate and set the angle of rotation.
          var angle = calculateRotation();
          rotateSelection('rotate(' + angle + 'deg)', 'top left');
          //Direction Specific adjustments
          var startPos = getLetter($scope.start.row, $scope.start.col).position();
          if($scope.start.col < $scope.current.row) { //Right
            //Reset the left/top position in case it was mangled when we got into Horizontal or Vertical movement
            $('#selection').css({
              left: startPos.left + 10,
              top:  startPos.top - 10
            });
          } else { //Left
            //Reset the left/top position in case it was mangled when we got into Horizontal or Vertical movement
            $('#selection').css({
              left: startPos.left + 30,
              top:  startPos.top + 10
            });
          }
        } else { //UP
          var colDiff = $scope.current.col - $scope.start.col;
          //Adjust the width and height
          $('#selection').css({
            width:    (Math.abs(colDiff) + 1) * diagonalLetterWidth,
            height:   diagonalLetterHeight
          });
          //Calculate and set the angle of rotation.
          var angle = calculateRotation();
          rotateSelection('rotate(' + angle + 'deg)', 'top left');
          //Direction Specific adjustments
          var startPos = getLetter($scope.start.row, $scope.start.col).position();
          if($scope.start.col < $scope.current.row) { //Right
            //TODO: weird thing when we go across the whole diagonal: selection jumps down and shifts upward
            //Reset the left/top position in case it was mangled when we got into Horizontal or Vertical movement
            $('#selection').css({
              left: startPos.left - 15,
              top:  startPos.top + 15
            });
          } else { //Left
            //Reset the left/top position in case it was mangled when we got into Horizontal or Vertical movement
            $('#selection').css({
              left: startPos.left + 7,
              top:  startPos.top + 33
            });
          }
        }

      }
    }
  };

  function rotateSelection(val, origin) {
    $('#selection').css('transform', val);
    $('#selection').css('transform-origin', origin);
  };

  function resetSelection() {
    $('#selection').hide();
    $('#selection').css({
      width: letterWidth,
      height: letterHeight,
    });
    rotateSelection('none', 'none');
    $scope.start = [];
    $scope.end = [];
    $scope.current = [];
    $scope.guess = "";
  };

  function checkGuess(guess) {
    //Check if the user has found a word in the list
    //TODO: maybe double check against the answer key? just in case a random collection of chars matches
    //one of the words
    if($scope.words.indexOf(guess) != -1 && $scope.foundWords.indexOf(guess) == -1) {
      $scope.foundWords.push(guess);
      //Cross the word off in the word list
      $('#' + guess).css("text-decoration", "line-through");
      $('#' + guess).css("text-decoration-color", "red");
      //Outline the found word in green
      var selectionDiv = $('#selection');
      var startPos = getLetter($scope.start.row, $scope.start.col).position();
      selectionDiv.before('<div id="found-' + guess + '" class="found"><div>');
      $('#found-' + guess).css({
        width:  selectionDiv.width(),
        height: selectionDiv.height(),
        left:   startPos.left,
        top:    startPos.top
      });
      var transform = $('#selection').css('transform');
      var transformOrigin = $('#selection').css('transform-origin');
      $('#found-' + guess).css('transform', transform);
      $('#found-' + guess).css('transform-origin', transformOrigin);
    }
  };

  function calculateGuess() {
    var guess = '';
    if ($scope.start.row == $scope.end.row && $scope.start.col != $scope.end.col) { //Horizontal
      if($scope.start.col < $scope.end.col) {
        for(var i = $scope.start.col; i <= $scope.end.col; i++) {
          guess += $scope.grid[$scope.start.row][i];
        }
      } else {
        for(var i = $scope.start.col; i >= $scope.end.col; i--) {
          guess += $scope.grid[$scope.start.row][i];
        }
      }
    } else if ($scope.start.row != $scope.end.row && $scope.start.col == $scope.end.col) { //Vertical
      if($scope.start.row < $scope.end.row) {
        for(var i = $scope.start.row; i <= $scope.end.row; i++) {
          guess += $scope.grid[i][$scope.start.col];
        }
      } else {
        for(var i = $scope.start.row; i >= $scope.end.row; i--) {
          guess += $scope.grid[i][$scope.start.col];
        }
      }
    } else { //Diagonal
      if($scope.start.col < $scope.end.col) { //Right
          if($scope.start.row < $scope.end.row) { //Down
            //start.row, start.col;
            var ccol = $scope.start.col;
            for(var i = $scope.start.row; i <= $scope.end.row; i++) {
              guess += $scope.grid[i][ccol];
              ccol += 1;
            }
         } else { //UP
           var ccol = $scope.start.col;
           for(var i = $scope.start.row; i >= $scope.end.row; i--) {
             guess += $scope.grid[i][ccol];
             ccol += 1;
           }
         }
      } else { // Left
        if($scope.start.row < $scope.end.row) { //Down
          var ccol = $scope.start.col;
          for(var i = $scope.start.row; i <= $scope.end.row; i++) {
            guess += $scope.grid[i][ccol];
            ccol -= 1;
          }
       } else { //UP
         var ccol = $scope.start.col;
         for(var i = $scope.start.row; i >= $scope.end.row; i--) {
           guess += $scope.grid[i][ccol];
           ccol -= 1;
         }
       }
      }
    }
    return guess;
  };

  function calculateRotation() {
    var startPoint = getLetter($scope.start.row, $scope.start.col).position();
    var endPoint = getLetter($scope.current.row, $scope.current.col).position();
    var b = endPoint.left - startPoint.left;
    var c = endPoint.top - startPoint.top;
    var angle = Math.atan2(c, b) * 180 / Math.PI;
    return Math.round(angle);
  };

}]);
