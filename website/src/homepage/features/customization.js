import {TableWrapper} from '../../components/table/table-wrapper';
import React from 'react';

export function Customization() {
  return (
    <div style={{marginTop: '80px'}}>
      <div style={{textAlign: 'center'}} className="feature-text-size">
        Your table, your style
      </div>
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
    </div>
  );
}
