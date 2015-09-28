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
            };
          };
        };
      };
    };

    this.makeYourMove = function makeYourMove(row, col) {
      if((this.gameOver === false) && (this.playerMove === true) && (this.theBoard[row][col] !== 'O') && (this.theBoard[row][col] !== 'X'))
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
        };
      };
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
          };
        };
      };
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
          };
      };
      //return winning;
    };

    this.resetBoard = function resetBoard() {
      this.theBoard = [ [ ' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
      this.gameWinner = 'No one yet!';
      this.playerMove = true;
      this.gameOver = false;
    };

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