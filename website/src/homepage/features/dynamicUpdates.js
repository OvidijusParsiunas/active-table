import {TableWrapper} from '../../components/table/table-wrapper';
import React from 'react';
import './features.css';

function updateCell(tableElement) {
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
    updateCell(tableElement);
  }, 10);
}

export function DynamicUpdates() {
  const dynamicUpdateTableContainer = React.useRef(null);
  setTimeout(() => {
    if (dynamicUpdateTableContainer.current) {
      setTimeout(() => updateCell(dynamicUpdateTableContainer.current.children[0]));
    }
  });

  return (
    <div style={{display: 'flex', marginTop: '120px'}}>
      <div style={{float: 'right', width: '50%'}}>
        <div ref={dynamicUpdateTableContainer} style={{width: '85%', float: 'right', marginRight: '10px'}}>
          <TableWrapper
            tableStyle={{borderRadius: '5px', width: '100%'}}
            displayIndexColumn={false}
            displayAddNewColumn={false}
            displayAddNewRow={false}
            customColumnsSettings={[
              {
                headerName: 'Stock',
                isCellTextEditable: true,
              },
              {
                headerName: 'Change',
                activeTypeName: 'Change',
                cellStyle: {fontWeight: '500'},
                dropdown: {isSortAvailable: false},
                customColumnTypes: [
                  {
                    name: 'Change',
                    customTextProcessing: {
                      changeStyleFunc: (cellText) => {
                        const percentageNumber = Number.parseFloat(cellText);
                        return {color: percentageNumber >= 0 ? 'green' : 'red'};
                      },
                    },
                  },
                ],
              },
              {
                headerName: 'Current',
                defaultColumnTypes: ['Currency'],
                cellStyle: {fontWeight: '500'},
                dropdown: {isSortAvailable: false},
              },
              {
                headerName: 'Last',
                cellStyle: {fontWeight: '500', color: 'grey'},
                headerStyles: {default: {color: '#575757'}},
                defaultColumnTypes: ['Currency'],
                dropdown: {isSortAvailable: false},
              },
            ]}
            stripedRows={{odd: {backgroundColor: ''}, even: {backgroundColor: '#eeeeee7a'}}}
            columnsSettings={{
              cellStyle: {paddingLeft: '10px'},
              isCellTextEditable: false,
              defaultColumnTypes: [],
              dropdown: {displaySettings: {openMethod: {overlayClick: true}}},
            }}
            displayHeaderIcons={false}
            content={[
              ['Stock', 'Current', 'Last', 'Change', 'Yield'],
              ['JPA', '4.5%', '1400MB', '0.2MB/s', '1.2Mbps'],
              ['REFR', '2.5%', '800MB', '0.1MB/s', '0.5Mbps'],
              ['CORA', '5.5%', '1000MB', '1.4MB/s', '0.7Mbps'],
              ['SOR', '1.5%', '1200MB', '1.2MB/s', '0.2Mbps'],
              ['LCRDA', '3.5%', '400MB', '0.8MB/s', '0.5Mbps'],
            ]}
          ></TableWrapper>
        </div>
      </div>
      <div style={{float: 'left', width: '50%'}}>
        <div className={'feature-text feature-text-size'}>Stream data and update table cells dynamically.</div>
      </div>
    </div>
  );
}
