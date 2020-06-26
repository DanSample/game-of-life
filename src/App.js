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
    this.rows = 20;
    this.columns = 30;
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
        this.rows = 20;
        this.columns = 30;
        break;
      case '2':
        this.rows = 40;
        this.columns = 60;
        break;
      default:
        this.rows = 60;
        this.columns = 80;
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
    console.log('hello');
    let currentGrid = this.state.grid;
    let newGrid = this.deepCopy(this.state.grid);
    // Iterate over the rows and columns
    for (let i = 0; i < this.rows; i++) {
      console.log('first loop');
      for (let j = 0; j < this.columns; j++) {
        console.log('second loop');
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
          <Dropdown.Item eventKey="1">20x30</Dropdown.Item>
          <Dropdown.Item eventKey="2">60x40</Dropdown.Item>
          <Dropdown.Item eventKey="3">80x60</Dropdown.Item>
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
      </>
    );
  }
}

export default App;
