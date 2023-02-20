import ActiveTableBrowser from '../../components/table/activeTableBrowser';
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

export function ProgrammaticUpdates() {
  const programmaticUpdateTableContainer = React.useRef(null);
  setTimeout(() => {
    if (programmaticUpdateTableContainer.current) {
      setTimeout(() => updateCell(programmaticUpdateTableContainer.current.children[0]));
    }
  });

  return (
    <div style={{display: 'flex', marginTop: '120px'}}>
      <div style={{float: 'right', width: '50%'}}>
        <div ref={programmaticUpdateTableContainer} style={{width: '85%', float: 'right', marginRight: '10px'}}>
          <ActiveTableBrowser
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
                defaultColumnTypeName: 'Change',
                cellStyle: {fontWeight: '500'},
                columnDropdown: {isSortAvailable: false},
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
                availableDefaultColumnTypes: ['Currency'],
                cellStyle: {fontWeight: '500'},
                columnDropdown: {isSortAvailable: false},
              },
              {
                headerName: 'Last',
                cellStyle: {fontWeight: '500', color: 'grey'},
                headerStyles: {default: {color: '#575757'}},
                availableDefaultColumnTypes: ['Currency'],
                columnDropdown: {isSortAvailable: false},
              },
            ]}
            stripedRows={{odd: {backgroundColor: ''}, even: {backgroundColor: '#eeeeee7a'}}}
            cellStyle={{paddingLeft: '10px'}}
            isCellTextEditable={false}
            availableDefaultColumnTypes={[]}
            columnDropdown={{displaySettings: {openMethod: {overlayClick: true}}}}
            displayHeaderIcons={false}
            content={[
              ['Stock', 'Current', 'Last', 'Change', 'Yield'],
              ['JPA', '88.22', '$85.73', '-0.1%', '1.4%'],
              ['REFR', '$18.52', '$88', '1.5%', '0.4%'],
              ['CORA', '$69.08', '$84.46', '0%', '1.6%'],
              ['SOR', '$46.84', '$48.69', '0.9%', '2.4%'],
              ['LCRDA', '$20.25', '$29.3', '0.4%', '0.8%'],
            ]}
          ></ActiveTableBrowser>
        </div>
      </div>
      <div style={{float: 'left', width: '50%'}}>
        <div className={'feature-text feature-text-size'}>
          Stream data and <b>update cells</b> programmatically without any manual input. Maximimise user experience by
          preconfiguring reactive on-text change styling.
        </div>
      </div>
    </div>
  );
}
