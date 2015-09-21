angular.module('tictactoe_modules', [])
  .factory('tictactoe_funcs', function() {
    const initialBoard = [ [ '', '', ''], ['', '', ''], ['', '', '']];

    return {
      initialBoard: initialBoard
    };
  });







// var boardState = [ ['X', 'O', 'X'],
//                    [ '', 'X', 'O'],
//                    [ '', 'O',  ''] ];


// function updateBoard(board) 
// {
//   for (var i = board.length - 1; i >= 0; i--) {
//     for (var j = board[i].length - 1; j >= 0; j--) {
//       if(board[i][j] === '')
//       {
//         board[i][j] = 'O';
//         return board;
//       };
//     };
//   };

//   return board;
// }

// function isWinningBoard(board) 
// {
//   var winning = false;
//   for (var i = board.length - 1; i >= 0; i--) 
//   {
//     if ((board[i][0] === board[i][1]) &&
//         (board[i][1] === board[i][2]) &&
//         (board[i][0] != ''))
//     {
//       winning = true;
//       break;
//     };
//   };
//   if(winning === false)
//   {
//     for (var i = board[0].length - 1; i >= 0; i--) 
//     {
//       if ((board[0][i] === board[1][i]) &&
//           (board[1][i] === board[2][i]) &&
//           (board[0][i] != ''))
//       {
//         winning = true;
//         break;
//       };
//     };
//   };
//   if(winning === false)
//   {
//       if ((board[0][0] === board[1][1]) &&
//           (board[1][1] === board[2][2]) &&
//           (board[0][0] != ''))
//       {
//         winning = true;
//       }
//       else if ((board[0][2] === board[1][1]) &&
//                (board[1][1] === board[2][0]) &&
//                (board[0][2] != ''))
//       {
//         winning = true;
//       };
//   }
//   return winning;
// }

// //This function should only be called if the isWinningBoard(board)
// //function returns 'true'.  This function assumes 'X' goes first.
// function whoWon(board) 
// {
//   var winner = '';
//   var numX = 0;
//   var numO = 0;
//   var numBlank = 0;
//   if (isWinningBoard(board) === true) 
//   {
//     for (var i = board.length - 1; i >= 0; i--) 
//     {
//       for (var j = board[i].length - 1; j >= 0; j--) 
//       {
//         if (board[i][j] === 'X')
//         {
//           numX++;
//         }
//         else if (board[i][j] === 'O')
//         {
//           numO++;
//         }
//         else
//         {
//           numBlank++;
//         }
//       };
//     };
//     winner = (numX > numO) ? 'X' : 'O';
//   };

//   return winner;
// }


// var assert = require('assert');

// describe('updateBoard', function() {
  
//   it('current boardState', function() {console.log(boardState)});
//   it('updateBoard should add "O" to the bottom right spot with boardState', function() {
//     assert.deepEqual(updateBoard(boardState), [ ['X', 'O', 'X'],[ '', 'X', 'O'],[ '', 'O',  'O'] ]);
//   });
//   it('current boardState', function() {console.log(boardState)});

//   it('Should return false', function() {
//     assert.deepEqual(isWinningBoard(boardState), false);
//   });

//   it('Should return ""', function() {
//     assert.deepEqual(whoWon(boardState), '');
//   });

//   it('current boardState', function() {console.log(boardState)});
//   it('updateBoard should add "O" to the bottom left spot with boardState', function() {
//     assert.deepEqual(updateBoard(boardState), [ ['X', 'O', 'X'],[ '', 'X', 'O'],[ 'O', 'O',  'O'] ]);
//   });
//   it('current boardState', function() {console.log(boardState)});

//   it('Should return true', function() {
//     assert.deepEqual(isWinningBoard(boardState), true);
//   });

//   it('Should return "O"', function() {
//     assert.deepEqual(whoWon(boardState), 'O');
//   });

// })




