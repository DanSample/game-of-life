import React, { useState } from 'react';

const numRows = 50;
const numColumns = 50;

const App = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      // Generate an array with Array and assign its length with numColumns
      // Array.from will generate the array and initializes the values to 0.
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    return rows;
  });

  console.log(grid);
  return <div className="App">Hello</div>;
};

export default App;
