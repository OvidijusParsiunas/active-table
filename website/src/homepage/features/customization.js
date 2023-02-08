import {TableWrapper} from '../../components/table/table-wrapper';
import React from 'react';

export function Customization() {
  return (
    <div style={{marginTop: '80px'}}>
      <div className="feature-style">Your table, your style</div>
      <div style={{display: 'flex', marginTop: '30px'}}>
        <div style={{float: 'left', width: '50%'}}>
          <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
            <TableWrapper
              tableStyle={{width: '100%'}}
              columnsSettings={{
                headerStyles: {default: {backgroundColor: '#5686b7', color: 'white'}},
                headerIconStyle: {
                  filterColor:
                    'brightness(0) saturate(100%) invert(98%) sepia(2%) saturate(6%) hue-rotate(76deg) brightness(100%) contrast(104%)',
                },
              }}
              rowHoverStyle={{style: {backgroundColor: '#e7f5ff'}}}
              frameComponentsStyle={{inheritHeaderColors: true}}
              displayAddNewColumn={false}
              content={[
                ['Planet', 'Diameter', 'Mass', 'Moons'],
                ['Earth', 12756, 5.97, 1],
                ['Mars', 6792, 0.642, 2],
                ['Jupiter', 142984, 1898, 79],
                ['Neptune', 49528, 102, 14],
              ]}
            ></TableWrapper>
          </div>
        </div>
        <div style={{float: 'left', width: '50%'}}>
          <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
            <TableWrapper
              tableStyle={{borderRadius: '5px', width: '100%'}}
              columnsSettings={{
                headerStyles: {default: {backgroundColor: '#52555b', color: 'white'}},
                headerIconStyle: {
                  filterColor:
                    'brightness(0) saturate(100%) invert(98%) sepia(2%) saturate(6%) hue-rotate(76deg) brightness(100%) contrast(104%)',
                },
              }}
              stripedRows={{odd: {backgroundColor: ''}, even: {backgroundColor: '#ebebeb7a'}}}
              frameComponentsStyle={{inheritHeaderColors: true}}
              content={[
                ['Planet', 'Diameter', 'Mass', 'Moons'],
                ['Earth', 12756, 5.97, 1],
                ['Mars', 6792, 0.642, 2],
                ['Jupiter', 142984, 1898, 79],
                ['Neptune', 49528, 102, 14],
              ]}
            ></TableWrapper>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', marginTop: '50px', width: '100%', justifyContent: 'center'}}>
        <div style={{width: '50%'}}>
          <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
            <TableWrapper
              tableStyle={{width: '100%', borderRadius: '3px', borderBottom: 'unset'}}
              columnsSettings={{
                headerStyles: {default: {backgroundColor: '#f9f9f9'}},
              }}
              pagination={{
                style: {
                  pageButtons: {
                    buttons: {
                      default: {
                        color: 'grey',
                        border: '1px solid #dedede',
                        marginRight: '5px',
                        marginTop: '5px',
                        height: '26px',
                        width: '31px',
                        paddingTop: '5px',
                        borderRadius: '20px',
                      },
                    },
                    activeButton: {default: {backgroundColor: '#45a6e6', color: 'white', border: '1px solid #45a6e6'}},
                    actionButtons: {default: {fontSize: '13px', paddingTop: '7px', height: '24px'}},
                    disabledButtons: {default: {backgroundColor: 'white'}},
                    firstVisibleButtonOverride: {},
                    lastVisibleButtonOverride: {},
                  },
                },
                displayFirstLast: false,
                rowsPerPageSelect: false,
                displayNumberOfVisibleRows: false,
                positions: {pageButtons: {side: 'bottom-middle'}},
                rowsPerPage: 5,
              }}
              dataStartsAtHeader={true}
              frameComponentsStyle={{inheritHeaderColors: true}}
              displayAddNewRow={false}
              displayAddNewColumn={false}
              content={[
                ['Planet', 'Diameter', 'Mass', 'Moons'],
                ['Earth', 12756, 5.97, 1],
                ['Mars', 6792, 0.642, 2],
                ['Jupiter', 142984, 1898, 79],
                ['Saturn', 120536, 568, 82],
                ['Neptune', 49528, 102, 14],
                ['Mercury', 4879, 0.33, 0],
                ['Venus', 12104, 4.87, 0],
                ['Uranus', 51118, 86.8, 27],
                ['Pluto', 2376, 0.013, 5],
                ['Moon', 3475, 0.073, 0],
                ['Neptune', 49528, 102, 14],
                ['Mercury', 4879, 0.33, 0],
                ['Neptune', 49528, 102, 14],
                ['Mercury', 4879, 0.33, 0],
                ['Mercury', 4879, 0.33, 0],
              ]}
            ></TableWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
