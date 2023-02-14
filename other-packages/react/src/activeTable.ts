import {ActiveTable as ActiveTableCore} from 'active-table';
import {createComponent} from '@lit-labs/react';
import * as React from 'react';

export const ActiveTable = createComponent({
  tagName: 'active-table',
  elementClass: ActiveTableCore,
  react: React,
  events: {
    onactivate: 'activate',
    onchange: 'change',
  },
});
