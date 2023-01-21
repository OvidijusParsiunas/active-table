import TableContainer from '@site/src/components/table/table-container';
import React from 'react';

function updateCell(tableElement) {
  setTimeout(() => {
    const rowIndex = Math.floor(Math.random() * 5 + 1);
    const columnIndex = Math.floor(Math.random() * 5 + 1);
    let newText = '';
    if (columnIndex === 1) {
      newText = `${Math.round(Math.random() * 20 * 10) / 10}%`;
    } else if (columnIndex === 2) {
      newText = `${Math.round(Math.random() * 1500 * 10) / 10}MB`;
    } else if (columnIndex === 3) {
      newText = `${Math.round(Math.random() * 1.5 * 10) / 10}MB/s`;
    } else {
      newText = `${Math.round(Math.random() * 1.5 * 10) / 10}Mbps`;
    }
    tableElement.setAttribute('updateCellText', JSON.stringify({newText, rowIndex, columnIndex}));
    updateCell(tableElement);
  }, 150);
}

export default function TableContainerDynamicUpdates({children}) {
  const dynamicUpdateTableContainer = React.useRef(null);
  if (dynamicUpdateTableContainer.current) {
    setTimeout(() => updateCell(dynamicUpdateTableContainer.current.children[0].children[0].children[0]));
  }
  return (
    <div ref={dynamicUpdateTableContainer}>
      <TableContainer>{children}</TableContainer>
    </div>
  );
}
