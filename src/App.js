import React, { useState } from 'react';
import produce from 'immer'; //https://css-tricks.com/using-immer-for-react-state-management/

const numRows = 50;
const numColumns = 50;

const App = () => {
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

  return (
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
  );
};

export default App;
