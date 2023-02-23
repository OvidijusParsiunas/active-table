import {ExploreButton} from './exploreButton/exploreButton';
import {SmallScreen} from './smallScreen/smallScreen';
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
        // REF-39
        const navToggle = require('@site/src/components/nav/autoNavToggle');
        setTimeout(() => {
          const navbar = document.querySelector('.plugin-pages > body > #__docusaurus > nav');
          // because the selector is used to set opacity 0 at the start - its opacity takes over
          // after the animation is finished - hence we manually set it here
          if (navbar) navbar.style.opacity = '1';
        }, 1700);
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
          <SmallScreen></SmallScreen>
          <ExploreButton></ExploreButton>
          <Footer></Footer>
        </div>
      </main>
    </Layout>
  );
}
