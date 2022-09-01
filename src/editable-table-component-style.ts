import {css} from 'lit';

export const ediTableStyle = css`
  .header {
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
    font-weight: 500;
  }

  .data {
    font-size: 13px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
  }

  .row {
    display: flex;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: rgba(0, 0, 0, 0.12);
    width: fit-content;
  }

  .row > div:first-child {
    padding-left: 16px;
    width: 106px;
  }

  .cell {
    text-align: left;
    padding: 6px;
    padding-top: 11px;
    min-height: 46px;
    box-sizing: border-box;
    outline: none;
    width: 100px;
    overflow-wrap: anywhere;
  }

  /* check if this is a good workaround for smaller devices */
  .cell:empty {
    text-align: left;
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
  }

  .table {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  }
`;
