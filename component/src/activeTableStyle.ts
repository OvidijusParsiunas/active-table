import {css} from 'lit';

/* REF-9 */
export const activeTableStyle = css`
  /* this is used to shrink the width of the active-table element to the shadow-root width */
  :host {
    /* the following property prevents outside styles from affecting this component */
    all: initial;
    /* the following property is used to control the overall component width */
    display: inline-block;
  }

  table {
    border-spacing: 0px;
    position: relative;
    border: 1px solid #00000028;
    background-color: white;
  }

  /* REF-16 */
  .table-controlled-width {
    table-layout: fixed;
    /* fit-content does not work correctly in firefox when there are not enough columns to fit parent */
    width: min-content;
  }

  tbody {
    border-radius: inherit;
  }

  tbody > .row:first-child > *:first-child {
    border-top-left-radius: inherit;
  }

  /* using last-of-type as the last element is a divider which does not help with corner rounding */
  tbody > .row:first-child > .cell:last-of-type {
    border-top-right-radius: inherit;
  }

  #last-visible-row > *:first-child {
    border-bottom-left-radius: inherit;
  }

  #last-visible-row > .cell:last-of-type {
    border-bottom-right-radius: inherit;
  }

  .row {
    color: rgba(0, 0, 0, 0.87);
    font-size: 13px;
    font-weight: 400;
    /* the following is not supported in Firefox (on rows), hence rowHoverStyles will not have the border */
    border-radius: inherit;
  }

  tbody > .row:first-child {
    position: relative;
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
    padding: 11px 6px 6px;
    font-size: 14px;
    line-height: 17px;
    height: 42.5px;
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
    border-right: 1px solid #00000021;
    color: #222222;
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
    color: #626262;
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
    /* cannot use grid as it does not align in Safari */
    display: table-cell;
  }

  .not-selectable {
    user-select: none;
    /* safari */
    -webkit-user-select: none;
  }

  .column-sizer {
    /* need z-index for the sizer to display over header icon */
    z-index: 1;
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
    z-index: 1;
  }

  .movable-column-sizer {
    z-index: 1;
  }

  .movable-column-sizer-vertical-line {
    width: 1px;
    pointer-events: none;
  }

  #add-new-row-cell {
    padding-top: 8px;
    padding-left: 17px;
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

  .header-cell-clone {
    position: absolute;
    cursor: move;
    top: 0px;
  }

  .header-cell-clone-animation {
    transition: 0.25s ease-out;
  }

  .header-cell-hidden {
    opacity: 0 !important;
  }

  .row-clone {
    position: absolute;
    display: flex;
    opacity: 0.8s;
  }

  .row-clone > * {
    cursor: move !important;
  }

  .row-drag-target-line {
    height: 4px;
    width: 100%;
    position: absolute;
    background-color: #69b0ff;
    pointer-events: none;
  }

  .root-cell {
    text-align: center;
    padding: 0px !important;
    border: none !important;
    // inheriting border radius as when frame components style background is set (add new row component), table border
    // radius is visibly not inherited
    border-radius: inherit;
  }

  .active-table-dropdown {
    position: absolute;
    box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
    border-radius: 5px;
    background-color: white;
    z-index: 1;
  }

  .active-table-dropup {
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px,
      rgba(15, 15, 15, 0.2) 0px -2px 24px;
    top: unset !important;
    bottom: 100%;
  }

  .cell-dropdown {
    overflow: auto;
    white-space: nowrap;
  }

  .cell-dropdown::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }

  .cell-dropdown::-webkit-scrollbar-thumb {
    background-color: #aaaaaa;
    border-radius: 5px;
  }

  .cell-dropdown::-webkit-scrollbar-track {
    background-color: #f2f2f2;
  }

  .dropdown-item {
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 5px;
    padding-left: 5px;
    color: #4b4b4b;
    position: relative;
    cursor: pointer;
    /* retaining the outline for dropdown input to make it easier to recognise */
    outline: none;
    font-size: 15px;
  }

  .cell-dropdown > .dropdown-item {
    /* the height of cell dropdown items seem to change depending on monitor size which inconsistently triggers overflow,
    this sets it to be consistent but ideally we should not do this and use a different way to allow any font sizes */
    height: 18px;
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
    padding-top: 4px;
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

  /* using different class as standard dropdowns use above class in their functionality */
  .active-static-dropdown-item {
    background-color: #4a69d4;
    color: white;
  }

  .active-dropdown-item:focus {
    background-color: #2148d5 !important;
    color: white !important;
  }

  /* Do not want to set default height incase user has set a font or a font-family so
    setting a placeholder text and making it invisible */
  .dropdown-item-empty {
    color: #ffffae00 !important;
  }

  .dropdown-disabled-item {
    pointer-events: none;
    color: #9e9e9e8a;
  }

  .cell-dropdown-option-button-container {
    position: absolute;
    width: 100%;
    height: 0px;
    top: 5px;
    left: -5px;
    display: none;
  }

  .cell-dropdown-option-button {
    height: 13px;
    width: 13px;
    position: sticky;
    z-index: 1;
    border-radius: 12px;
    opacity: 0.3;
    background-color: white;
  }

  .cell-dropdown-option-button:hover {
    opacity: 1;
  }

  .cell-dropdown-option-button:active {
    background-color: #f8f8f8;
  }

  .cell-dropdown-option-button > div {
    font-size: 12px;
    height: 11px;
    pointer-events: none;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cell-dropdown-option-delete-button-icon {
    font-size: 12.5px;
    width: 13px;
  }

  .cell-dropdown-option-color-button-icon {
    width: 12.5px;
  }

  .outer-container-dropdown {
    z-index: 2;
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

  #drag-and-drop-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    height: calc(100% - 10px);
    width: calc(100% - 10px);
    background-color: #70c6ff4d;
    border: 5px dashed #6dafff;
    display: none;
    z-index: 2;
  }

  .filter-hidden-row {
    display: none;
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
    right: 0;
    display: flex;
    width: fit-content;
    height: fit-content;
  }

  .pagination-button {
    border: 1px solid #0000004d;
    border-right: unset;
    color: #353535;
    min-width: 31px;
    height: 30.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15.5px;
    /* REF-40 */
    stroke: black;
  }

  .pagination-prev-next-button {
    width: 14.25px;
    padding-left: 4px;
  }

  .pagination-first-last-button {
    width: 13px;
  }

  .pagination-button > * {
    pointer-events: none;
  }

  .pagination-button-disabled {
    pointer-events: none;
    color: #7c7c7c;
    /* REF-40 */
    stroke: #7c7c7c;
  }

  .pagination-button > svg > path {
    /* REF-40 */
    stroke: inherit;
  }

  #pagination-number-of-visible-rows {
    padding-top: 6px;
    color: #252525;
    min-width: 82px;
    text-align: center;
    font-size: 15.5px;
    padding-top: 7.5px;
  }

  #pagination-number-of-rows-select {
    position: relative;
    color: #1d1d1d;
    min-width: max-content;
  }

  #pagination-number-of-rows-select-text {
    font-size: 15.5px;
    float: left;
    margin-top: 6px;
  }

  #rows-per-page-select-button {
    display: inline-block;
    background-color: white;
    border: 1px solid #0000004d;
    border-radius: 4px;
    height: 24px;
    padding-top: 3px;
    padding-bottom: 0.5px;
    padding-left: 6px;
    padding-right: 1px;
    margin-top: 1px;
    cursor: pointer;
  }

  .outer-dropdown-button-arrow-container {
    pointer-events: none;
    color: #353535;
    font-size: 16px;
    float: right;
    margin: 1px;
    margin-left: -1px;
    width: 19px;
  }

  .outer-dropdown-button-arrow-icon {
    width: 16px;
    transform: scale(0.9, 1);
    filter: brightness(0) saturate(100%) invert(11%) sepia(3%) saturate(99%) hue-rotate(157deg) brightness(97%)
      contrast(98%);
    padding-top: 2px;
    padding-left: 2px;
  }

  #rows-per-page-select-button-text {
    display: inline-block;
    pointer-events: none;
    padding-top: 1px;
  }

  .number-of-rows-dropdown-item {
    padding-right: 12.5px;
    text-align: right;
  }

  .file-button-container {
    position: relative;
  }

  .file-button {
    border: 1px solid #00000038;
    border-radius: 3px;
    color: #464646;
    text-align: center;
    cursor: pointer;
    user-select: none;
    background-color: #f8f8f9;
    font-size: 14.5px;
    align-items: center;
    display: flex;
    height: 29px;
    padding: 0px 10px 1px;
  }

  .file-button-arrow-container {
    margin-right: -5px;
  }

  .file-button-arrow-container-icon {
    width: 17px;
    padding-top: 5px;
  }

  .export-formats-dropdown-item {
    padding: 4px 10px;
    font-size: 14.5px;
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

  .outer-container {
    display: grid;
    position: relative;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  #outer-top-container > div > div > div > * {
    margin-bottom: 13px;
  }

  #outer-bottom-container > div > div > div > * {
    margin-top: 13px;
  }

  /* REF-38 */
  .outer-container-column {
    display: flex;
    width: 0px;
  }

  .outer-container-column-inner {
    display: flex;
  }

  .outer-container-column-content {
    display: flex;
    /* use -webkit-max-content if the below does not work */
    width: max-content;
  }

  .outer-container-left-column .outer-container-column-content > div {
    margin-right: 10px;
  }

  .outer-container-center-column {
    justify-content: center;
    position: absolute;
  }

  .outer-container-center-column .outer-container-column-content > div {
    margin-left: 5px;
    margin-right: 5px;
  }

  .outer-container-right-column {
    justify-content: end;
  }

  .outer-container-right-column .outer-container-column-content > div {
    margin-left: 10px;
  }

  /* right sibling */
  .pagination-button-active-precedence + div {
    border-left-color: #fafafa01 !important;
  }

  .sticky-header-body > *:first-child {
    top: 0;
    position: sticky !important;
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

  .filter-rows-container {
    position: relative;
  }

  .filter-rows-input {
    width: 150px;
    height: 20px;
    border: 1px solid #0000002b;
    border-radius: 4px;
    color: rgb(45, 45, 45);
    font-family: inherit;
    padding: 5px 6px;
    font-size: 14px;
  }

  .filter-rows-input::placeholder {
    color: var(--active-table-filter-placeholder-color);
  }

  .filter-rows-dropdown-button {
    position: absolute;
    right: 4px;
    top: 51.6%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
    filter: brightness(0) saturate(100%) invert(49%) sepia(0%) saturate(974%) hue-rotate(66deg) brightness(97%)
      contrast(96%);
    width: 16px;
    height: 16px;
  }

  .filter-rows-dropdown-button + .filter-rows-case-button {
    right: 15px;
  }

  .filter-rows-case-button + .filter-rows-input {
    padding-right: 30px;
    width: 129px;
  }

  .filter-rows-dropdown-button + .filter-rows-input {
    padding-right: 22px;
    width: 137px;
  }

  .filter-rows-dropdown-button + .filter-rows-case-button + .filter-rows-input {
    padding-right: 45px;
    width: 114px;
  }

  .filter-rows-case-button {
    position: absolute;
    right: 0px;
    top: 49%;
    transform: translate(-50%, -50%);
    color: grey;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }

  .filter-rows-dropdown {
    min-width: 100% !important;
    width: max-content !important;
  }

  .filter-rows-dropdown > .dropdown-item {
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
`;
