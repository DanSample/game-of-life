import React, { Component } from 'react';
import produce from 'immer'; //https://css-tricks.com/using-immer-for-react-state-management/

// Instantiated a couple variables for the row and columns

const numRows = 50;
const numColumns = 50;

// Logic to deal with the neighboring cells

const neighboringCells = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, -1],
];

// The main function, setting the initial state.

class App extends Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.columns = 50;
    this.state = {
      generation: 0,
      grid: Array(this.rows)
        .fills()
        .map(() => Array(this.columns).fill(false)),
    };
  }

  // This is to handle the different grid sizes

  gridSize = (size) => {
    switch (size) {
      case '1':
        this.columns = 30;
        this.rows = 20;
        break;
      case '2':
        this.columns = 60;
        this.rows = 40;
        break;
      default:
        this.columns = 80;
        this.rows = 60;
    }
    this.reset();
  };

  // This will reset the grid when called

  reset = () => {
    let grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0,
    });
  };

  // A function to deal with deep coping the grid, for the double buffer

  deepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };

  // A function to turn cells on and off

  selectBox = (row, col) => {
    let gridCopy = this.deepCopy(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  };

  startButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  stopButton = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.startButton();
  };

  fast = () => {
    this.speed = 100;
    this.startButton();
  };

  // A function to randomize the grid

  randomGrid = () => {
    const rows = []; // Create rows
    for (let i = 0; i < numRows; i++) {
      // A lot like the logic above, in the main function setting the grid. This will
      // randomly generate the cells on the grid to populate.
      rows.push(
        Array.from(Array(numColumns), () => (Math.random() > 0.5 ? 1 : 0))
      ); // the second parameter of Array.from is a mapping function that gives a key and
      // value, you can initialize the values, which I'm doing here randomly with math.random().
    }
    // set the grid in state
    this.setState({
      grid: rows,
    });
  };

  runSim = () => {
    let currentGrid = this.state.grid;
    let newGrid = this.deepCopy(this.state.grid);
    // Iterate over the rows and columns
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        let neighbors = 0;

        // Check every neighboring cell
        neighboringCells.forEach(([a, b]) => {
          // Set new values for the neighboring cells based on i and j location
          const newI = i + a;
          const newJ = j + b;
          // Make sure we don't go beyond the neighboring cells
          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
            neighbors += currentGrid[newI][newJ];
          }
        });

        // Changes depending on neighboring cells

        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = 0;
        } else if (currentGrid[i][j] === 0 && neighbors === 3) {
          newGrid[i][j] = 1;
        }
      }
      this.setState({ grid: newGrid });
    }
  };

  render() {
    return (
      <>
        <button
          onClick={() => {
            this.runSim();
          }}
        >
          {'Start'}
        </button>
        <button
          onClick={() => {
            this.randomGrid();
          }}
        >
          Randomize
        </button>
        <div></div>
      </>
    );
  }
}

export default App;
