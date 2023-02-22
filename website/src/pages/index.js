import {ExploreButton} from './exploreButton/exploreButton';
import {StartPanel} from './startPanel/startPanel';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {Features} from './features/features';
import {Footer} from './footer/footer';
import Layout from '@theme/Layout';
import React from 'react';
import './index.css';

function FadeInNav() {
  return (
    <BrowserOnly>
      {() => {
        const navToggle = require('@site/src/nav/autoNavToggle');
        // REF-39
        navToggle.fadeIn();
        navToggle.readdAutoNavToggle();
      }}
    </BrowserOnly>
  );
}

export default function Home() {
  return (
    <Layout description="Fully customisable editable table component">
      <main>
        <FadeInNav></FadeInNav>
        <div id="homepage-content">
          <StartPanel></StartPanel>
          <Features></Features>
          <ExploreButton></ExploreButton>
          <Footer></Footer>
        </div>
      </main>
    </Layout>
  );
}
