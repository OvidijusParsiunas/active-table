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
    position: relative;
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

  .category-cell-text {
    outline: none;
    overflow-wrap: anywhere;
    padding-left: 6px;
    padding-right: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
    border-radius: 4px;
    width: fit-content;
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

  .category-dropdown {
    overflow: auto;
  }

  .dropdown-item {
    padding-top: 1px;
    padding-bottom: 1px;
    padding-right: 5px;
    padding-left: 5px;
    color: grey;
    position: relative;
    cursor: pointer;
    user-select: none;
    /* for safari */
    -webkit-user-select: none;
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

  .category-delete-button-container {
    position: absolute;
    width: 100%;
    height: 0px;
    top: 5px;
    left: -5px;
    display: none;
  }

  .category-delete-button {
    height: 13px;
    width: 13px;
    position: sticky;
    background-color: #ffffff70;
    z-index: 1;
    border-radius: 12px;
    opacity: 0.3;
    background-color: white;
  }

  .category-delete-button:hover {
    opacity: 1;
  }

  .category-delete-button-icon {
    position: absolute;
    color: grey;
    left: 2px;
    top: -3px;
    font-size: 14px;
    pointer-events: none;
    color: black;
  }

  #full-table-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;
