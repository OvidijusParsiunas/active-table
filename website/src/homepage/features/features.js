import {TableWrapper} from '../../components/table/table-wrapper';
import {Customization} from './customization';
import {Responsive} from './responsive';
import {Scrollbar} from './scrollbar';
import React from 'react';
import './features.css';

function Pagination() {
  return (
    <div style={{display: 'flex', marginTop: '120px'}}>
      <div style={{float: 'right', width: '49%'}}>
        <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
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
            ]}
          ></TableWrapper>
        </div>
      </div>
      <div style={{float: 'left', width: '50%'}}>
        <div className={'feature-text feature-text-size'}>
          Use pagination to split up data into multiple pages and simplify table navigation
        </div>
      </div>
    </div>
  );
}

function ColumnTypes() {
  return (
    <div style={{display: 'flex', marginTop: '80px'}}>
      <div style={{float: 'left', width: '50%'}}>
        <div className={'feature-text feature-text-size'}>
          Active table offers a variety of out of the box column types and an extensive API to create custom ones that
          incl. custom sorting, validation, selection options and more.
        </div>
      </div>
      <div style={{float: 'right', width: '50%'}}>
        <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
          <TableWrapper
            tableStyle={{borderRadius: '5px', width: '100%'}}
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
  );
}

export function Features() {
  return (
    <div id="features-container">
      <h1 className="colored-sub-header">Main Features</h1>
      <ColumnTypes></ColumnTypes>
      <Scrollbar></Scrollbar>
      <Pagination></Pagination>
      <Responsive></Responsive>
      <Customization></Customization>
    </div>
  );
}
