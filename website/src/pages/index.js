import ActiveTableBrowser from '../components/table/activeTableBrowser';
import {Features} from '../homepage/features/features';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import React from 'react';

function LeftPanel() {
  return (
    <div id="left-panel">
      <h1 id="colored-header">Active Table</h1>
      <h1 id="sub-header">Framework agnostic table component for editable data experience</h1>
    </div>
  );
}

function RightPanel() {
  return (
    <div id="right-panel">
      {/* WORK - can remove this div once the right-panel id can be used to determine width */}
      <div style={{width: '100%'}}>
        <ActiveTableBrowser
          tableStyle={{borderRadius: '5px', width: '580px'}}
          customColumnsSettings={[
            {
              headerName: 'Category',
              defaultColumnTypeName: 'Label',
              // customColumnTypes: [
              //   {
              //     name: 'Hobbies',
              //     label: {
              //       options: [
              //         {text: 'Furniture', backgroundColor: '#cdfef7'},
              //         {text: 'Vehicles', backgroundColor: '#d6ffbd'},
              //         {text: 'Electronics', backgroundColor: '#afdffd'},
              //       ],
              //     },
              //   },
              // ],
            },
            {headerName: 'Sale date', defaultColumnTypeName: 'Date d-m-y'},
            // {headerName: 'Verified', defaultColumnTypeName: 'Checkbox'},
            {headerName: 'Price', defaultColumnTypeName: 'Currency'},
          ]}
          content={[
            ['Name', 'Category', 'Sale date', 'Price'],
            ['Car', 'Vehicles', '20/07/2012', '$6800.00'],
            ['Laptop', 'Electronics', '08/11/2014', '$700'],
            ['Chair', 'Furniture', '05/02/2019', '$20.00'],
            ['Apples', 'Food', '10/04/2022', '$1.00'],
            ['Bracelet', 'Jewellery', '10/06/1998', '$180.00'],
            ['Jeans', 'Clothing', '16/02/2023', '$70.00'],
          ]}
        ></ActiveTableBrowser>
      </div>
    </div>
  );
}

function StartPage() {
  const leftTableRef = React.useRef(null);
  return (
    <div id="start-page" style={{position: 'relative', width: '100%'}}>
      <div
        ref={leftTableRef}
        id="start-page-content"
        className={'invisible-component'}
        style={{
          position: 'absolute',
          marginTop: 0,
          marginBottom: 0,
          top: '50%',
          marginLeft: '55px',
          marginRight: '55px',
        }}
      >
        <LeftPanel></LeftPanel>
        <RightPanel></RightPanel>
        <BrowserOnly>
          {() => {
            require('active-table-react');
            leftTableRef.current.className = 'fade-in-component';
          }}
        </BrowserOnly>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout description="Fully customisable editable table component">
      <main>
        <div id="homepage-content">
          <StartPage></StartPage>
          <Features></Features>
          <div
            style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '120px', marginBottom: '120px'}}
          >
            <a className={'header-button custom-button'} href="docs/table">
              Explore API for more
            </a>
          </div>
        </div>
        <div id="footer">
          Built by{' '}
          <a href="https://github.com/OvidijusParsiunas" target="_blank">
            Ovidijus Parsiunas
          </a>
          . Source code is available on{' '}
          <a href="https://github.com/OvidijusParsiunas/active-table" target="_blank">
            GitHub
          </a>
          .
        </div>
      </main>
      <BrowserOnly>{() => require('@site/src/nav/autoNavToggle').readdAutoNavToggle()}</BrowserOnly>
    </Layout>
  );
}
