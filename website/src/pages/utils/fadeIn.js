import BrowserOnly from '@docusaurus/BrowserOnly';
import React from 'react';

export function FadeInNav() {
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

export function FadeInContent({contentRef}) {
  return (
    <BrowserOnly>
      {() => {
        // REF-39 - code synchronous
        require('active-table-react');
        // in a timeout as moving back to the homepage from a different tab has the page ref 'current' as null
        setTimeout(() => {
          if (contentRef?.current) contentRef.current.className = 'fade-in';
        });
      }}
    </BrowserOnly>
  );
}

export default {FadeInNav, FadeInContent};
