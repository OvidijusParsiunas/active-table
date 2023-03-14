import TableContainer, {extractChildTableElement} from '@site/src/components/table/tableContainer';
import React from 'react';

function updateStockCell(tableElement) {
  if (!tableElement?.isConnected) return;
  setTimeout(() => {
    const rowIndex = Math.floor(Math.random() * 5 + 1);
    const columnIndex = Math.floor(Math.random() * 5 + 1);
    let newText = '';
    if (columnIndex === 1) {
      newText = `$${Math.round(Math.random() * 1000 * 10) / 100}`;
    } else if (columnIndex === 2) {
      newText = `$${Math.round(Math.random() * 1000 * 10) / 100}`;
    } else if (columnIndex === 3) {
      newText = `${((Math.round(Math.random()) ? 1 : -1) * Math.round(Math.random() * 1.5 * 10)) / 10}%`;
    } else {
      newText = `${Math.round(Math.random() * 2.5 * 10) / 10}%`;
    }
    tableElement.updateCell({newText, rowIndex, columnIndex});
    updateStockCell(tableElement);
  }, 10);
}

function updateComputerCell(tableElement) {
  if (!tableElement?.isConnected) return;
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
    tableElement?.updateCell({newText, rowIndex, columnIndex});
    updateComputerCell(tableElement);
  }, 40);
}

export default function TableContainerProgrammaticUpdates({children, isStock, minHeight}) {
  const programmaticUpdateTableContainer = React.useRef(null);
  if (programmaticUpdateTableContainer.current) {
    const updateFunc = isStock ? updateStockCell : updateComputerCell;
    setTimeout(() => {
      const activeTableReference = extractChildTableElement(programmaticUpdateTableContainer.current?.children[0]);
      updateFunc(activeTableReference);
    });
  }
  return (
    <div ref={programmaticUpdateTableContainer}>
      <TableContainer minHeight={minHeight}>{children}</TableContainer>
    </div>
  );
}
