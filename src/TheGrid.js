import React from 'react';
import TheCell from './TheCell';

const TheGrid = (props) => {
  let rowsArr = [];

  let cellClass = '';
  for (let x = 0; x < props.rows; x++) {
    for (let y = 0; y < props.columns; y++) {
      // ternary used to select box on (black) or off (on) when just hovering
      cellClass = props.grid[x][y] ? 'box on' : 'box off';
      rowsArr.push(
        <TheCell
          selectBox={props.selectBox}
          cellClass={cellClass}
          key={`${x}-${y}`}
          rows={x}
          columns={y}
        />
      );
    }
  }

  return (
    <div
      className="the-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 12px)`,
      }}
    >
      {rowsArr}
    </div>
  );
};

export default TheGrid;
