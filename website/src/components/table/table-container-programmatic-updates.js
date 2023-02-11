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
    tableElement.updateCell({newText, rowIndex, columnIndex});
    updateCell(tableElement);
  }, 40);
}

export default function TableContainerProgrammaticUpdates({children}) {
  const programmaticUpdateTableContainer = React.useRef(null);
  if (programmaticUpdateTableContainer.current) {
    setTimeout(() => updateCell(programmaticUpdateTableContainer.current.children[0].children[0].children[0]));
  }
  return (
    <div ref={programmaticUpdateTableContainer}>
      <TableContainer>{children}</TableContainer>
    </div>
  );
}
