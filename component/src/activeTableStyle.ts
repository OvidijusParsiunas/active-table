import {css} from 'lit';

/* REF-9 */
export const activeTableStyle = css`
  /* this is used to shrink the width of the active-table element to the shadow-root width */
  :host {
    /* the following property prevents outside styles from affecting this component */
    all: initial;
    display: inline-block;
  }

  table {
    border-spacing: 0px;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    position: relative;
    border: 1px solid #00000026;
    background-color: white;
  }

  /* REF-16 */
  .table-controlled-width {
    table-layout: fixed;
    /* fit-content does not work correctly in firefox when there are not enough columns to fit parent */
    width: min-content;
  }

  .row {
    color: rgba(0, 0, 0, 0.87);
    font-size: 13px;
    font-weight: 400;
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
    font-size: inherit;
    font-weight: inherit;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0, 0, 0, 0.12);
    vertical-align: top;
    text-align: left;
    border-right: 1px solid #0000001f;
  }

  .cell-text-div {
    outline: none;
    overflow-wrap: anywhere;
    border-radius: 4px;
    width: fit-content;
    /* need padding for the cursor to show up */
    padding-left: 1px;
  }

  .select-cell-text {
    float: left;
  }

  .arrow-down-icon-container {
    position: relative;
  }

  .arrow-down-icon {
    position: absolute;
    right: 2px;
    top: 5px;
    text-align: center;
    cursor: pointer;
  }

  .label-cell-text {
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
    color: #575757;
    padding-top: 12px;
    padding-bottom: 12px;
    font-weight: 500;
  }

  .header-icon-container {
    float: left;
    pointer-events: none;
    /* the height is set to allow the text to be present below the icon when there is not enough space in the cell */
    height: 15px;
  }

  .header-icon-side-text {
    /* cannot use flex as pressing ENTER creates a new div */
    display: grid;
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
    text-align: center;
  }

  .no-content-stub {
    text-align: center;
    padding: 0px !important;
    border: none !important;
  }

  .active-table-dropdown {
    position: absolute;
    box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
    border-radius: 5px;
    background-color: white;
    z-index: 1;
  }

  .select-dropdown {
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
    align-items: initial;
    padding-top: 2px;
    /* if items are not aligned in center - change align-items to center and revert changes
      in 0805a911cd5c7921aa05b13ffb9387d3d996c133 */
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

  .select-button {
    height: 13px;
    width: 13px;
    position: sticky;
    z-index: 1;
    border-radius: 12px;
    opacity: 0.3;
    background-color: white;
  }

  .select-button:hover {
    opacity: 1;
  }

  .select-button-icon {
    position: absolute;
    color: grey;
    left: 2px;
    top: -3px;
    font-size: 14px;
    pointer-events: none;
    color: black;
  }

  .select-button-container {
    position: absolute;
    width: 100%;
    height: 0px;
    top: 5px;
    left: -5px;
    display: none;
  }

  .select-color-button-icon {
    position: absolute;
    font-size: 13px;
    top: -3.2px;
    left: 3px;
    pointer-events: none;
    color: black;
  }

  .color-input {
    width: 0px;
    height: 0px;
    padding: 0px;
    position: absolute;
    outline: none;
    pointer-events: none;
    opacity: 0;
    /* border unset stops color picker panel from appearing in safari */
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
    border: 1px solid black;
    border-radius: 2px;
    right: 0;
    display: flex;
    width: fit-content;
    height: fit-content;
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
    padding-top: 2px;
    position: relative;
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

  .pagination-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  #pagination-top-container > div > * {
    margin-bottom: 10px;
  }

  #pagination-bottom-container > div > * {
    margin-top: 10px;
  }

  .pagination-container-column {
    display: flex;
  }

  .pagination-container-left-column > div {
    margin-right: 10px;
  }

  .pagination-container-middle-column {
    justify-content: center;
  }

  .pagination-container-middle-column > div {
    margin-left: 10px;
    margin-right: 10px;
  }

  .pagination-container-right-column {
    justify-content: end;
  }

  .pagination-container-right-column > div {
    margin-left: 10px;
  }

  .sticky-header-body > *:first-child {
    top: 0;
    position: sticky;
  }

  .sticky-header-body > *:first-child > th {
    background-color: white;
  }

  #overflow-container {
    border: 1px solid #00000026;
  }

  /* REF-37 */
  .no-overflow-sticky-header-body {
    border-top: 1px solid #00000026;
  }

  /* REF-37 */
  .no-overflow-sticky-header-body > *:first-child {
    border-top: inherit;
  }

  /* REF-37 */
  .no-overflow-sticky-header-body > *:first-child > th {
    border-top: inherit !important;
  }
`;
