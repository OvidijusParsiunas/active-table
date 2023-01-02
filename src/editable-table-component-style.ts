import {css} from 'lit';

/* REF-9 */
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

  /* REF-16 */
  .table-controlled-width {
    table-layout: fixed;
    /* fit-content does not work correctly in firefox when there are not enough columns to fit parent */
    width: min-content;
  }

  .row > *:first-child {
    border-left: none !important;
  }

  .row > .cell:last-of-type {
    border-right: none !important;
  }

  /* REF-25 */
  #last-visible-row > .cell {
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

  .cell-text-div {
    outline: none;
    overflow-wrap: anywhere;
    border-radius: 4px;
    width: fit-content;
    /* need padding for the cursor to show up */
    padding-left: 1px;
  }

  .category-text-div {
    padding-left: 6px;
    padding-right: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .cell-divider {
    position: absolute;
    display: flex;
    justify-content: center;
    height: inherit;
  }

  .cell-divider > * {
    user-select: none;
    /* safari */
    -webkit-user-select: none;
    position: absolute;
    cursor: col-resize;
    justify-content: center;
    height: inherit;
  }

  /* this class needs to be after .cell to have style precendence */
  /* REF-1 */
  .header-cell {
    border-top: none !important;
    cursor: pointer;
    color: grey;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .header-icon-container {
    float: left;
    pointer-events: none;
    /* the height is set to allow the text to be present below the icon when there is not enough space in the cell */
    height: 15px;
  }

  .header-icon-side-text {
    display: flex;
  }

  .not-selectable {
    user-select: none;
    /* safari */
    -webkit-user-select: none;
  }

  .column-sizer {
    background-size: 20px 5px;
    position: absolute;
  }

  .column-sizer-filler {
    height: inherit;
    position: absolute;
    pointer-events: none;
  }

  .column-sizer-overlay {
    background-color: #ff000001;
  }

  .movable-column-sizer-vertical-line {
    width: 1px;
    pointer-events: none;
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

  .index-cell {
    text-align: center;
    padding: 11px 4px 0px !important;
  }

  .index-cell-overflow {
    overflow: hidden;
    overflow-wrap: normal;
  }

  .add-column-cell {
    cursor: pointer;
  }

  .no-content-stub {
    text-align: center;
    padding: 0px !important;
  }

  .editable-table-component-dropdown {
    position: absolute;
    box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
    border-radius: 5px;
    background-color: white;
    z-index: 1;
  }

  .category-dropdown {
    overflow: auto;
    white-space: nowrap;
  }

  .dropdown-item {
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 5px;
    padding-left: 5px;
    color: #4b4b4b;
    position: relative;
    cursor: pointer;
    /* retaining the outline for dropdown input to make it easier to recognise */
    outline: none;
    font-size: 15px;
  }

  .dropdown-item-icon-container {
    display: flex;
    float: left;
    height: 90%;
    align-items: center;
  }

  .dropdown-title-item {
    cursor: default;
    color: #7c7c7c;
    font-weight: 600;
    font-size: 0.75rem;
    margin-top: 2px;
  }

  .dropdown-input-item {
    text-align: center;
  }

  .dropdown-input {
    width: 92%;
    border: 1px solid grey;
    border-radius: 2px;
    color: #2d2d2d;
    font-size: 14px;
    padding: 3px;
  }

  .dropdown-item-divider {
    border-bottom: 1px solid #d4d4d4;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .dropdown-highlightable-item:hover {
    background-color: #eaeaea;
  }

  .active-dropdown-item {
    background-color: #4a69d4;
    color: white;
  }

  .active-dropdown-item:focus {
    background-color: #2148d5 !important;
    color: white !important;
  }

  .dropdown-disabled-item {
    pointer-events: none;
    color: #9e9e9e8a;
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

  .date-input-container {
    position: relative;
    float: right;
    cursor: pointer;
  }

  .date-input {
    top: 17px;
    width: 0px;
    height: 0px;
    border: unset;
    padding: 0px;
    right: 9px;
    position: absolute;
    outline: none;
  }

  .calender-icon-container {
    position: absolute;
    right: 2px;
    top: -4px;
    width: 15px;
    height: 25px;
    text-align: center;
  }

  #full-table-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .dropdown-cell-overlay {
    cursor: pointer;
    background-color: grey;
  }

  .column-dropdown-cell-overlay {
    transition: height 0.2s;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .row-dropdown-cell-overlay {
    transition: width 0.2s;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  #pagination-button-container {
    border-radius: 2px;
    right: 0;
    display: flex;
    width: fit-content;
  }

  .pagination-button {
    border-right: 1px solid black;
    width: 28px;
    height: 25px;
    padding-top: 3px;
    text-align: center;
    cursor: pointer;
  }

  .pagination-button-disabled {
    pointer-events: none;
  }

  .pagination-button:last-child {
    border-right: 0px;
    border-top-right-radius: 1px;
    border-bottom-right-radius: 1px;
  }

  .pagination-button:first-child {
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
  }

  #pagination-number-of-visible-rows {
    padding-top: 4px;
  }

  #pagination-of-rows-options {
    padding-top: 4px;
    float: right;
  }

  #pagination-of-rows-options-text {
    display: inline-block;
  }

  #pagination-of-rows-options-button {
    display: inline-block;
    border: 1px solid grey;
    border-radius: 5px;
    cursor: pointer;
  }

  #pagination-of-rows-options-button-arrow {
    display: inline-block;
    pointer-events: none;
    color: #353535;
  }

  #pagination-of-rows-options-button-text {
    display: inline-block;
    pointer-events: none;
  }

  .pagination-text-component {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  }

  .number-of-rows-dropdown-item {
    padding-left: 10px;
  }

  .hidden-row {
    line-height: 0px;
    height: 0px !important;
    user-select: none;
    pointer-events: none;
  }

  .hidden-row > * {
    line-height: 0px;
    height: 0px;
    padding: 0px !important;
    font-size: 0px;
    border-bottom-width: 0px !important;
  }

  .hidden-row > th > * {
    display: none;
  }
`;
