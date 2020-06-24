import React, { useState, useCallback, useRef, useEffect } from 'react';
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

// The main function, setting the running and initial grid state.

const App = () => {
  const [generation, setGeneration] = useState(0);
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    // initialize [rows]
    const rows = [];
    // iterate over the numRows to create the grid
    for (let i = 0; i < numRows; i++) {
      // Generate an array with Array and assign its length with numColumns
      // Array.from will generate the array and initializes the values to 0.
      // Push those values to the [rows]
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    return rows;
  });

  console.log(grid);

  // A function to deal with deep coping the grid, for the double buffer

  function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  // Created some objects for styling the grid layout

  const columnStyle = (x, y) => ({
    width: '20px',
    height: '20px',
    backgroundColor: grid[x][y] ? 'black' : 'white',
    border: 'solid 1px black',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${numColumns}, 20px)`,
  };

  // A function to randomize the grid

  const randomGrid = () => {
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
    setGrid(rows);
  };

  // Set the generation state

  /* Since runSim will only render once, the value for our base case will not stay
  updated to the current value of running. Here I use the useRef() hook to solve
  that. It creates a mutable .current reference object that does not cause a re-render when
  it value is updated https://reactjs.org/docs/hooks-reference.html#useref. */

  const runningRef = useRef(running);
  runningRef.current = running;

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const genRef = useRef(generation);
  genRef.current = generation;

  /* The run simulator of the life of the cells, this function will recursively
  call itself until the button, it will be used on, is clicked to stop it. useCallback()
  will return a memoized version of the callback that only changes if one of the 
  dependencies has changed. This will prevent unnecessary re-renders
  https://reactjs.org/docs/hooks-reference.html#usecallback. */

  const runSim = () => {
    let currentGrid = grid;
    let newGrid = arrayClone(grid);
    // the base case
    if (!running) {
      return;
    }
    // the simulation
    for (let i = 0; i < numRows; i++) {
      // and iterate through all columns
      for (let j = 0; j < numColumns; j++) {
        // n is for neighbors
        let neighbors = 0;

        // Check every sub array of the neighborLogic array
        neighboringCells.forEach(([a, b]) => {
          // Set new values for the sub array based on i and j location
          const newI = i + a;
          const newJ = j + b;
          // Ensure that we don't go outside our 8 neighbors
          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
            neighbors += currentGrid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = 0;
        } else if (currentGrid[i][j] === 0 && neighbors === 3) {
          newGrid[i][j] = 1;
        }
      }
      return newGrid;
    }
    setGrid(newGrid);
    console.log(newGrid, 'this is the new grid state');
    setGeneration(generation + 1);
    console.log(running, grid);
    setTimeout(runSim, 1000);
  };

  useEffect(() => {
    setRunning(runningRef.current);
  }, [runningRef]);

  return (
    <>
      <button
        onClick={() => {
          runSim();
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={() => {
          randomGrid();
        }}
      >
        Random
      </button>
      <div style={gridStyle}>
        {grid.map((rows, x) =>
          rows.map((col, y) => (
            <div
              key={`${x}-${y}`}
              /*  Since state is meant to be immutable, I am using the produce() function 
            from Immer to create a "draft" of the state. This allows the draft of state 
            to be safely manipulated without disturbing the original state. The draft is
            given to a messenger then returns the draft to the state. The changes made to 
            the draft, then get applied to the state. In this way, It does not break the 
            idea of an immutable state, as the current state does not get updated directly. 
            */
              onClick={() => {
                setGrid(
                  produce(grid, (gridDraft) => {
                    gridDraft[x][y] = grid[x][y] ? 0 : 1;
                  })
                );
              }}
              style={columnStyle(x, y)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
