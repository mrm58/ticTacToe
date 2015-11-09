angular.module('bewd.tictactoe.board', []);
//second argument is for dependencies (we don't need any now since were just using angular)

angular.module('bewd.tictactoe.board')
  .controller('BoardCtrl', function(){
    this.playerMove = true;
    this.gameWinner = 'No one yet!';
    this.gameOver = false;

    this.makeComputerMove = function makeComputerMove() {
      if((this.playerMove === false) && (this.gameOver === false))
      {
        for (var i = this.theBoard.length - 1; i >= 0; i--)
        {
          for (var j = this.theBoard[i].length - 1; j >= 0; j--)
          {
            if((this.theBoard[i][j] !== 'O') && (this.theBoard[i][j] !== 'X'))
            {
              this.theBoard[i][j] = 'O';
              this.playerMove = true;
              i = -1;
              j = -1;
            }
          }
        }
      }
    };

    this.makeYourMove = function makeYourMove(row, col) {
      if((this.gameOver === false) &&
         (this.playerMove === true) &&
         (this.theBoard[row][col] !== 'O') &&
         (this.theBoard[row][col] !== 'X'))
      {
        this.theBoard[row][col] = 'X';
        this.playerMove = false;
      }
    };

    this.isWinningBoard = function isWinningBoard()
    {
      for (var i = this.theBoard.length - 1; i >= 0; i--)
      {
        if ((this.theBoard[i][0] === this.theBoard[i][1]) &&
            (this.theBoard[i][1] === this.theBoard[i][2]) &&
            ((this.theBoard[i][0] === 'X') || (this.theBoard[i][0] === 'O')))
        {
          this.gameOver = true;
          this.gameWinner = this.theBoard[i][0];
          break;
        }
      }
      if(this.gameOver === false)
      {
        for (var i = this.theBoard[0].length - 1; i >= 0; i--)
        {
          if ((this.theBoard[0][i] === this.theBoard[1][i]) &&
              (this.theBoard[1][i] === this.theBoard[2][i]) &&
              ((this.theBoard[0][i] === 'X') || (this.theBoard[0][i] === 'O')))
          {
            this.gameOver = true;
            this.gameWinner = this.theBoard[0][i];
            break;
          }
        }
      }
      if(this.gameOver === false)
      {
          if ((this.theBoard[0][0] === this.theBoard[1][1]) &&
              (this.theBoard[1][1] === this.theBoard[2][2]) &&
              ((this.theBoard[0][0] === 'X') || (this.theBoard[0][0] === 'O')))
          {
            this.gameWinner = this.theBoard[0][0];
            this.gameOver = true;
          }
          else if ((this.theBoard[0][2] === this.theBoard[1][1]) &&
                   (this.theBoard[1][1] === this.theBoard[2][0]) &&
                   ((this.theBoard[0][2] === 'X') || (this.theBoard[0][2] === 'O')))
          {
            this.gameWinner = this.theBoard[0][2];
            this.gameOver = true;
          }
      }
      //return winning;
    };

    this.resetBoard = function resetBoard() {
      this.theBoard = [ [ ' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
      this.gameWinner = 'No one yet!';
      this.playerMove = true;
      this.gameOver = false;
    };
    //this.makeYourMove = function makeYourMove() {
      //this.theBoard[2][2] = 'Y';
    //};
  })
  .directive('ticTacToeBoard', function() {
    return {
      scope: {
        theBoard: '='
      },
      restrict: 'E',
      templateUrl: '/public/tmpls/board.html',
      controller: 'BoardCtrl',
      controllerAs: 'vm',
      bindToController: true
    };
  });

angular.module('bewd.tictactoe.board')
  .factory('boardService', ['$http', function($http) {
    return {
      getBoards: function() {
        // AJAX request
        return $http.get('/games')
          .then(function(response) {
            return response.data;
          });
      },
      getBoard: function(id) {
        return $http.get('/games/' + id)
          .then(function(response) {
            return response.data;
          });
      },
      updateBoard: function(id, board) {
        return $http.put('/games/' + id, { board:board })
          .then(function(response) {
            return response.data;
          });
      }
    };
  }])
  .controller('BoardsController', BoardsController);

  BoardsController.$inject = ['boardService', '$interval', '$log', '$scope'];
  function BoardsController(boardService, $interval, $log, $scope) {
    var vm = this;

    var boardRefresher;
    vm.selectBoard = function selectBoard(board) {
      vm.selectedBoard = board;

      if (boardRefresher) {
        $interval.cancel(boardRefresher);
      }
      boardRefresher = $interval(function() {
        boardService.getBoard(board.id).then(function(b) {
          vm.selectedBoard = b;
        });
      }, 1000);
    };

    function loadBoards() {
      boardService.getBoards().then(function(boards) {
        $log.debug("boards response is ", boards);
        vm.boards = boards;
      });
    }

    loadBoards();
    var boardLoader = $interval(loadBoards, 10000);
    $scope.$on('$destroy', function() {
      $interval.cancel(boardLoader);
    });
  }

angular.module('bewd.tictactoe.board')
  // .controller('BoardController', function(boardService, $routeParams) {
  //   console.log($routeParams);
  //   var vm = this;
  //   boardService.getBoard($routeParams.id).then(function(board) {
  //     vm.theBoard = board.board;
  //   });
  // });
  .controller('BoardController', function(boardObj) {
    this.theBoard = boardObj.board;
  });
