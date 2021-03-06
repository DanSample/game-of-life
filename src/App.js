import React, { Component } from 'react';
import './index.css';
import TheGrid from './TheGrid';
import { DropdownButton, Dropdown } from 'react-bootstrap';

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
    this.rows = 25;
    this.columns = 25;
    this.state = {
      generation: 0,
      grid: Array(this.rows)
        .fill()
        .map(() => Array(this.columns).fill(0)),
    };
  }
  // This is to handle the different grid sizes

  gridSize = (size) => {
    switch (size) {
      case '1':
        this.rows = 25;
        this.columns = 25;
        break;
      case '2':
        this.rows = 35;
        this.columns = 35;
        break;
      default:
        this.rows = 50;
        this.columns = 50;
    }
    this.reset();
  };

  handleSelect = (e) => {
    this.gridSize(e);
  };

  // This will reset the grid when called

  reset = () => {
    let grid = Array(this.rows)
      .fill()
      .map(() => Array(this.columns).fill(0));
    this.setState({
      grid: grid,
      generation: 0,
    });
  };

  // A function to deal with deep coping the grid, for the double buffer

  deepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };

  // A function to turn cells on and off

  selectBox = (row, column) => {
    let gridCopy = this.deepCopy(this.state.grid);
    gridCopy[row][column] = !gridCopy[row][column];
    this.setState({
      grid: gridCopy,
    });
  };

  start = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.runSim, this.speed);
  };

  stop = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.start();
  };

  fast = () => {
    this.speed = 100;
    this.start();
  };

  // A function to randomize the grid

  randomGrid = () => {
    const rows = []; // Create rows
    for (let i = 0; i < this.rows; i++) {
      // A lot like the logic above, in the main function setting the grid. This will
      // randomly generate the cells on the grid to populate.
      rows.push(
        Array.from(Array(this.columns), () => (Math.random() > 0.5 ? 1 : 0))
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
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let neighbors = 0;

        // Check every neighboring cell
        neighboringCells.forEach(([a, b]) => {
          // Set new values for the neighboring cells based on i and j location
          const newI = i + a;
          const newJ = j + b;
          // Make sure we don't go beyond the neighboring cells
          if (
            newI >= 0 &&
            newI < this.rows &&
            newJ >= 0 &&
            newJ < this.columns
          ) {
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
    }
    this.setState({ grid: newGrid, generation: this.state.generation + 1 });
  };

  render() {
    return (
      <>
        <DropdownButton
          title="Select a Size"
          id="size-menu"
          onSelect={this.handleSelect}
        >
          <Dropdown.Item eventKey="1">25x25</Dropdown.Item>
          <Dropdown.Item eventKey="2">35x35</Dropdown.Item>
          <Dropdown.Item eventKey="3">50x50</Dropdown.Item>
        </DropdownButton>
        <button
          onClick={() => {
            this.start();
          }}
        >
          {'Start'}
        </button>
        <button
          onClick={() => {
            this.stop();
          }}
        >
          {'Stop'}
        </button>
        <button
          onClick={() => {
            this.randomGrid();
          }}
        >
          {'Randomize'}
        </button>
        <button
          onClick={() => {
            this.fast();
          }}
        >
          {'Fast'}
        </button>
        <button
          onClick={() => {
            this.slow();
          }}
        >
          {'Slow'}
        </button>
        <button
          onClick={() => {
            this.reset();
          }}
        >
          {'Clear'}
        </button>
        <TheGrid
          selectBox={this.selectBox}
          grid={this.state.grid}
          rows={this.rows}
          columns={this.columns}
        />
        <h2>Generations: {this.state.generation}</h2>
        <p>
          The universe of the Game of Life is an infinite, two-dimensional
          orthogonal grid of square cells, each of which is in one of two
          possible states, live or dead, (or populated and unpopulated,
          respectively). Every cell interacts with its eight neighbours, which
          are the cells that are horizontally, vertically, or diagonally
          adjacent. At each step in time, the following transitions occur: Any
          live cell with fewer than two live neighbours dies, as if by
          underpopulation. Any live cell with two or three live neighbours lives
          on to the next generation. Any live cell with more than three live
          neighbours dies, as if by overpopulation. Any dead cell with exactly
          three live neighbours becomes a live cell, as if by reproduction.
          These rules, which compare the behavior of the automaton to real life,
          can be condensed into the following: Any live cell with two or three
          live neighbours survives. Any dead cell with three live neighbours
          becomes a live cell. All other live cells die in the next generation.
          Similarly, all other dead cells stay dead. The initial pattern
          constitutes the seed of the system. The first generation is created by
          applying the above rules simultaneously to every cell in the seed;
          births and deaths occur simultaneously, and the discrete moment at
          which this happens is sometimes called a tick. Each generation is a
          pure function of the preceding one. The rules continue to be applied
          repeatedly to create further generations.
        </p>
      </>
    );
  }
}

export default App;
