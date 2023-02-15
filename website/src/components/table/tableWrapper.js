import {createComponent} from '@lit-labs/react';
import {ActiveTable} from 'active-table';
import * as React from 'react';

// TO-DO use react package for this
// Remove @lit-labs/react from package
export const TableWrapper = createComponent({
  tagName: 'active-table',
  elementClass: ActiveTable,
  react: React,
  events: {
    onactivate: 'activate',
    onchange: 'change',
  },
});