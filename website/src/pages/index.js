import {TableWrapper} from '../components/table/tableWrapper';
import {readdAutoNavToggle} from '../nav/autoNavToggle';
import {Features} from '../homepage/features/features';
import Layout from '@theme/Layout';
import React from 'react';

function LeftPanel() {
  return (
    <div id="left-panel">
      <h1 id="colored-header">Active Table</h1>
      <h1 id="sub-header">Framework agnostic table component for editable data experience</h1>
      <div style={{marginTop: '30px'}}>
        <button className="header-button">Install</button>
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
            ['Mercury', 4879, 0.33, 0],
          ]}
        ></TableWrapper>
      </div>
    </div>
  );
}

function StartPage() {
  return (
    <div id="start-page" style={{position: 'relative', width: '100%'}}>
      <div
        id="start-page-content"
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
      </div>
    </div>
  );
}

export default function Home() {
  readdAutoNavToggle();
  return (
    <Layout description="Fully customisable editable table component">
      <main>
        <div id="homepage-content">
          <StartPage></StartPage>
          <Features></Features>
          <div
            style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '120px', marginBottom: '120px'}}
          >
            <button className={'header-button custom-button'} style={{backgroundColor: 'blue'}}>
              Explore API for more
            </button>
          </div>
        </div>
        by Ovidijus Parsiunas
      </main>
    </Layout>
  );
}
