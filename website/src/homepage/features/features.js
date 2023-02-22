import ActiveTableBrowser from '../../components/table/activeTableBrowser';
import {ProgrammaticUpdates} from './programmaticUpdates';
import {Customization} from './customization';
import {Responsive} from './responsive';
import {Overflow} from './overflow';
import React from 'react';
import './features.css';

//  In the future - move this section to its own webpage and replace it with reviews-statistics-comments etc.

function ColumnTypes() {
  return (
    <div style={{display: 'flex', marginTop: '80px'}}>
      <div style={{float: 'left', width: '50%'}}>
        <div className={'feature-text feature-text-size'}>
          Active table offers a variety of <b>column types</b> and an extensive API to create custom ones with custom
          sorting, validation, selection options and more.
        </div>
      </div>
      <div style={{float: 'right', width: '50%'}}>
        <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
          <ActiveTableBrowser
            tableStyle={{borderRadius: '5px', width: '100%'}}
            customColumnsSettings={[
              {
                headerName: 'Name',
                defaultColumnTypeName: 'Name',
                customColumnTypes: [
                  {
                    name: 'Name',
                    label: {
                      options: [
                        {text: 'Peter', backgroundColor: '#cdfef7'},
                        {text: 'John', backgroundColor: '#d6ffbd'},
                        {text: 'Gregg', backgroundColor: '#fdd1e1'},
                        {text: 'Jeff', backgroundColor: '#fff2c2'},
                      ],
                    },
                  },
                ],
              },
              {headerName: 'Date of Birth', defaultColumnTypeName: 'Date d-m-y'},
              {
                headerName: 'Hobby',
                defaultColumnTypeName: 'Hobbies',
                customColumnTypes: [
                  {
                    name: 'Hobbies',
                    iconSettings: {reusableIconName: 'Select'},
                    select: {options: ['Fishing', 'Soccer', 'Reading']},
                  },
                ],
              },
              {headerName: 'Verified', defaultColumnTypeName: 'Checkbox'},
            ]}
            content={[
              ['Name', 'Date of Birth', 'Hobby', 'Verified'],
              ['Peter', '12-08-1992', 'Fishing', 'true'],
              ['John', '14-10-2012', 'Soccer', 'false'],
              ['Gregg', '05-02-1975', 'Reading', 'true'],
              ['Jeff', '24-04-2015', 'Soccer', 'false'],
            ]}
          ></ActiveTableBrowser>
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
      <ProgrammaticUpdates></ProgrammaticUpdates>
      <Responsive></Responsive>
      <Overflow></Overflow>
      <Customization></Customization>
    </div>
  );
}
