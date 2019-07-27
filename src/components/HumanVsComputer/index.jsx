// @flow

import React from 'react';
import type { Node } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';

import { breakPoints, colors } from '../../utils/themes.jsx';

import { minimaxRoot } from './helper.jsx';

const DIFFICULTY = 2;

type Props = {
  children?: Iterable<Node>
};
type State = {
  fen: string,
  squareStyles: Object,
  pieceSquare: Object
};

class HumanVsComputer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fen: 'start',
      squareStyles: {},
      pieceSquare: ''
    };
  }

  componentDidMount() {
    this.game = new Chess();
  }

  game = () => {};

  makeComputerMoveHard = () => {
    const bestMove = minimaxRoot(DIFFICULTY, this.game, true, 'b');
    this.game.move(bestMove);
    this.setState({
      fen: this.game.fen(),
      squareStyles: {
        [this.game.history({ verbose: true })[this.game.history().length - 1]
          .to]: {
          backgroundColor: colors.cornflowerBlue
        }
      }
    });

    if (this.game.game_over()) {
      alert('Game Over!');
    }
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    const move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 1);
  };

  onSquareClick = square => {
    const { pieceSquare } = this.state;
    this.setState({
      squareStyles: { [square]: { backgroundColor: colors.cornflowerBlue } },
      pieceSquare: square
    });

    const move = this.game.move({
      from: pieceSquare,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });

    window.setTimeout(this.makeComputerMoveHard, 1);
  };

  render() {
    const { fen, squareStyles } = this.state;
    const { children } = this.props;

    /* $FlowFixMe */
    return children({
      position: fen,
      onDrop: this.onDrop,
      onSquareClick: this.onSquareClick,
      squareStyles
    });
  }
}

export default function PlayComputerEngine() {
  return (
    <div>
      <HumanVsComputer>
        {/* $FlowFixMe */}
        {({ position, onDrop, onSquareClick, squareStyles }) => (
          <Chessboard
            calcWidth={({ screenWidth, screenHeight }) =>
              screenWidth < breakPoints.small
                ? 0.75 * screenWidth
                : screenWidth < breakPoints.medium
                ? 0.5 * screenWidth
                : screenWidth < breakPoints.large
                ? 0.4 * screenWidth
                : 0.3 * screenWidth
            }
            id="humanVsComputer"
            position={position}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
            lightSquareStyle={{ backgroundColor: colors.athensGrey }}
            darkSquareStyle={{ backgroundColor: colors.saffron }}
            dropSquareStyle={{
              boxShadow: `inset 0 0 1px 4px ${colors.cornflowerBlue}`
            }}
            showNotation={false}
          />
        )}
      </HumanVsComputer>
    </div>
  );
}
