import {TableWrapper} from '../components/table/table-wrapper';
import Layout from '@theme/Layout';
import React from 'react';

function LeftPanel() {
  return (
    <div id="left-panel">
      <h1 id="colored-header">Active Table</h1>
      <h1 id="sub-header">Framework agnostic table component for editable data experience</h1>
      <div style={{marginTop: '30px'}}>
        <button className="header-button">Install</button>
        <button className="header-button">Documentation</button>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div id="right-panel">
      {/* WORK - can remove this div once the right-panel id can be used to determine width */}
      <div style={{width: '100%'}}>
        <TableWrapper
          tableStyle={{borderRadius: '5px', width: '100%'}}
          content={[
            ['Planet', 'Diameter', 'Mass', 'Moons'],
            ['Earth', 12756, 5.97, 1],
            ['Mars', 6792, 0.642, 2],
            ['Jupiter', 142984, 1898, 79],
            ['Saturn', 120536, 568, 82],
            ['Neptune', 49528, 102, 14],
          ]}
        ></TableWrapper>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout description="Fully customisable editable table component">
      <main>
        <div style={{height: '100vh'}}>
          <LeftPanel></LeftPanel>
          <RightPanel></RightPanel>
        </div>
      </main>
    </Layout>
  );
}
