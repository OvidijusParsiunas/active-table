import {css} from 'lit';

export const ediTableStyle = css`
  table {
    border-spacing: 0px;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  /* REF-1 */
  tbody > *:first-child > th {
    border-top: none !important;
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
    font-weight: 500;
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

  .cell-divider {
    position: absolute;
    display: flex;
    justify-content: center;
  }

  .add-new-row-row:hover {
    background-color: #f4f4f4;
    cursor: pointer;
  }

  .add-new-row-cell {
    padding-top: 8px;
    min-height: 28px;
    line-height: 18px;
    font-size: 12px;
    color: #555555;
    vertical-align: middle;
  }
`;
