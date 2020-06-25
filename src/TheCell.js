import React from 'react';

const TheCell = (props) => {
  const selectBox = () => {
    props.selectBox(props.rows, props.columns);
  };
  return <div className={props.cellClass} onClick={selectBox} />;
};

export default TheCell;
