import {css} from 'lit';

export const ediTableStyle = css`
  /* this is used to shrink the width of the editable-table-component element to the shadow-root width */
  :host {
    display: inline-block;
  }

  table {
    border-spacing: 0px;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  tbody {
    position: relative;
  }

  /* REF-1 */
  tbody > *:first-child > th {
    border-top: none !important;
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
    font-weight: 500;
  }

  th {
    cursor: pointer;
    user-select: none;
  }

  td {
    /* REF-2 */
    cursor: text;
  }

  .row > *:first-child {
    border-left: none !important;
    padding-left: 16px;
  }

  .row > .cell:last-of-type {
    border-right: none !important;
  }

  tbody > tr:last-of-type > .cell {
    border-bottom: none !important;
  }

  .cell {
    text-align: left;
    padding: 6px;
    padding-top: 11px;
    height: 43px;
    box-sizing: border-box;
    outline: none;
    overflow-wrap: anywhere;
    font-size: 13px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0, 0, 0, 0.12);
    vertical-align: top;
    text-align: left;
  }

  .cell-divider {
    position: absolute;
    display: flex;
    justify-content: center;
  }

  .column-sizer {
    border-left: 1px solid;
    border-right: 1px solid;
    background-size: 20px 5px;
    position: absolute;
    user-select: none;
    cursor: col-resize;
    display: flex;
    justify-content: center;
    z-index: 1;
  }

  .column-sizer-overlay {
    height: inherit;
    position: absolute;
    pointer-events: none;
  }

  #add-new-row-row:hover {
    background-color: #f7f7f7;
  }

  #add-new-row-cell {
    padding-top: 8px;
    min-height: 28px;
    line-height: 18px;
    font-size: 12px;
    color: #555555;
    vertical-align: middle;
    cursor: pointer;
  }

  .editable-table-component-dropdown {
    position: absolute;
    box-shadow: rgb(232 232 232) 0px 2px 5px 0px;
    border-radius: 5px;
    background-color: white;
    z-index: 1;
  }

  .dropdown-item {
    padding-top: 1px;
    padding-bottom: 1px;
    padding-right: 5px;
    padding-left: 5px;
    color: grey;
    cursor: pointer;
    user-select: none;
    position: relative;
  }

  .dropdown-title-item {
    cursor: default;
  }

  .dropdown-input-item {
    text-align: center;
  }

  .dropdown-hoverable-item:hover {
    background-color: #eaeaea;
  }

  #full-table-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;
