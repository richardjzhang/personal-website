// @flow
import { pieceValue } from './values.jsx';

export const convertFen = (fenArray: Array<string>) => {
  // Transform into following format:
  // [[{type: 'p', color: 'b', value: 100}, {type: 'q', color: 'b', value: 1000}, ...], [...], ...]
  const board = [[]];
  let count = 0;
  for (let i = 0; i < fenArray.length; i += 1) {
    if (fenArray[i] === ' ') break;
    if (!['/', '1', '2', '3', '4', '5', '6', '7', '8'].includes(fenArray[i])) {
      if (fenArray[i] === fenArray[i].toUpperCase()) {
        board[count].push({
          type: fenArray[i],
          color: 'w',
          value: pieceValue[fenArray[i].toLowerCase()]
        });
      } else {
        board[count].push({
          type: fenArray[i],
          color: 'b',
          value: pieceValue[fenArray[i]]
        });
      }
    } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(fenArray[i])) {
      for (let j = 0; j < parseInt(fenArray[i], 10); j += 1) {
        board[count].push(undefined);
      }
    }

    if (fenArray[i] === '/') {
      count += 1;
      board[count] = [];
    }
  }
  return board;
};

export const evaluateBoard = (
  board: Array<
    Array<{
      type: string,
      color: string,
      value: number
    }>
  >,
  color: string
) => {
  // Loop through all pieces on the board and sum up total
  let value = 0;
  board.forEach(row => {
    row.forEach(piece => {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += piece.value * (piece.color === color ? 1 : -1);
      }
    });
  });

  return value;
};

export const minMax = (
  depth: number,
  game: Object,
  playerColor: string,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
) => {
  let value;
  // Recursive case: search possible moves
  let bestMove = null; // best move not set yet
  const possibleMoves = game.moves();

  // Base case: evaluate board
  if (depth === 0) {
    const board = convertFen(game.fen().split(''));
    /* $FlowFixMe */
    value = evaluateBoard(board, playerColor);
    return [value, null];
  }

  // Set random order for possible moves
  possibleMoves.sort(() => 0.5 - Math.random());
  // Set a default best move value
  let bestMoveValue = isMaximizingPlayer
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (let i = 0; i < possibleMoves.length; i += 1) {
    const move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = minMax(
      depth - 1,
      game,
      playerColor,
      alpha,
      beta,
      !isMaximizingPlayer
    )[0];
    // Log the value of this move
    console.log(
      isMaximizingPlayer ? 'Max: ' : 'Min: ',
      depth,
      move,
      value,
      bestMove,
      bestMoveValue
    );
    // Look for moves that maximize position
    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    // Undo previous move
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }
  return [bestMoveValue, bestMove || possibleMoves[0]];
};