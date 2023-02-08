import {TableWrapper} from '../../components/table/table-wrapper';
import React from 'react';

export function Overflow() {
  return (
    <div style={{marginTop: '120px'}}>
      <div style={{textAlign: 'center'}} className="feature-text-size">
        Data consolidation
      </div>
      <div style={{display: 'flex', marginTop: '30px'}}>
        <div style={{float: 'left', width: '50%'}}>
          <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
            <TableWrapper
              tableStyle={{borderRadius: '5px', width: '100%'}}
              overflow={{maxHeight: '258px'}}
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
              ]}
            ></TableWrapper>
          </div>
        </div>
        <div style={{float: 'left', width: '50%'}}>
          <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
            <TableWrapper
              tableStyle={{borderRadius: '5px', width: '100%'}}
              pagination={{rowsPerPage: 4}}
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
              ]}
            ></TableWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
