import React, { useState } from 'react';

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
          <div key={`${x}-${y}`} style={columnStyle(x, y)} />
        ))
      )}
    </div>
  );
};

export default App;
