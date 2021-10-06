import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Button, Box, Grid, Typography  } from '@material-ui/core';
import { Circle, Cancel } from '@mui/icons-material';

class Piece extends React.Component {
  getIcon() {
    if (this.props.name === "O") {
      return <Circle />
    } else if (this.props.name === "X") {
      return <Cancel />
    }
  }

  render() {
    return (
        <div>
          {this.getIcon()}
        </div>
    );
  }
}

class Square extends React.Component {
 
  render() {
    return (
      <Button 
        className="square" 
        variant="outlined"

        onClick={_=>this.props.onClick()}>
          <Piece name={this.props.value}/>
      </Button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let value = this.props.squares[i]
    return (
      <Square 
        value={value}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((step, pos) => {
      return (
        <Grid 
          item xs={4} 
          align="center"
          // style={{ border: "1px solid grey" }}
        >
          {this.renderSquare(pos)}
        </Grid>
      );
    });

    return (
      <div className="board">
        <Grid container 
          spacing={0}>
          {squares}
        </Grid>
      </div>
    );
  }
}

class Moves extends React.Component {
  render() {
    const moves = this.props.history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <Grid item /*key={move}*/ >
          <Button  
            variant="outlined"
            color="primary" 
            onClick={()=> this.props.onClick(move)}>
              {desc}
          </Button>
        </Grid>
      );
    });

    return(
      <Grid container direction="column" style={{height:'150px', width: '300px'}}>
          { moves }    
      </Grid>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null), 
          next: 'X'
        },
      ],
      winner: null,
      stepNumber: 0,
    }
  }

  jumpTo(step){
    const history = this.state.history.slice(0, step + 1)
    this.setState({
      history: history,
      stepNumber: step,
      winner: calculateWinner(history[history.length - 1].squares)
    });
  }

  getCurrent() {
    const history = this.state.history;
    return history[history.length - 1];
  }

  getStatus(){
    const current = this.getCurrent();

    return this.state.winner ?
        `The winner is ${this.state.winner}` :
        `Next player: ${current.next}`;
  }

  handleClick(i){
    if (this.state.winner)
      return;

    const current = this.getCurrent();
    const squares = current.squares.slice();

    if (squares[i])
      return;

    squares[i] = current.next;

    //Agrega un nuevo elemento a la historia
    const history = this.state.history.concat([{
          squares: squares,
          next: current.next === 'X' ? 'O' : 'X',
        }]);

    this.setState({
        history: history,
        winner: calculateWinner(squares),
        stepNumber: history.length
      });
  }

  render() {
    const current = this.getCurrent();

    return (
      <Box className="game">
        
        <div className="status"><Typography variant="h4">{this.getStatus()}</Typography></div>
        <div>
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <Moves 
              history={this.state.history} 
              onClick={(step) => this.jumpTo(step)}/>
          </div>
        </div>
      </Box>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(tictactoe) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winLines.length; i++) {
    const [a, b, c] = winLines[i];
    if (tictactoe[a]
      && tictactoe[a] === tictactoe[b]
      && tictactoe[a] === tictactoe[c]) {

        return tictactoe[a]; //returns the winner
    }
  }
  return null;
}


