import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer'; //https://css-tricks.com/using-immer-for-react-state-management/

const numRows = 50;
const numColumns = 50;
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

const App = () => {
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

  const randomGrid = () => {
    const rows = []; // Create rows
    for (let i = 0; i < numRows; i++) {
      // A lot like the logic above, in the main function setting the grid. This will
      // randomly generate the cells on the grid to populate.
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
      ); // the second parameter of Array.from is a mapping function that gives a key and
      // value, you can initialize the values, which I'm doing here.
    }
    // set the grid in state
    setGrid(rows);
  };

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

  /* Since runSim will only render once, the value for our base case will not stay
  updated to the current value of running. Here I use the useRef() hook to solve
  that. It creates a mutable .current reference object that does not cause a re-render when
  it value is updated https://reactjs.org/docs/hooks-reference.html#useref. */

  const runRef = useRef(running);
  runRef.current = running;

  /* The run simulator of the life of the cells, this function will recursively
  call itself until the button, it will be used on, is clicked to stop it. useCallback()
  will return a memoized version of the callback that only changes if one of the 
  dependencies has changed. This will prevent unnecessary re-renders
  https://reactjs.org/docs/hooks-reference.html#usecallback. */

  const runSim = useCallback(() => {
    // the base case
    if (!runRef.current) {
      return;
    }
    // the simulation
    setTimeout(runSim, 1000);
  });

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? 'stop' : 'start'}
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
