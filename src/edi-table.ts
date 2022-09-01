import {LitElement, html, HTMLTemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ediTableStyle} from './edi-table-style';

type TableRow = (number | string)[];
type TableContents = TableRow[];

@customElement('edi-table')
export class MyElement extends LitElement {
  static override styles = [ediTableStyle];

  @property()
  name = 'World';

  @property({type: Number})
  count = 0;

  @property({type: Array})
  contents: TableContents = [
    [1, 2, 3, 4],
    [1, 2, 3, 4, 6],
  ];

  override render() {
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <div>${this.generateTable()}</div>
      <slot></slot>
    `;
  }

  private generateCells(dataRow: TableRow): HTMLTemplateResult[] {
    return dataRow.map((cellText: string | number) => {
      // https://lit.dev/docs/localization/best-practices
      // check if this is re-rendered when a text value is changed
      return html`<div>${cellText}</div>`;
    });
  }

  private populateDataRow(dataRow: TableRow): HTMLTemplateResult {
    return html`<div class="row">${this.generateCells(dataRow)}</div>`;
  }

  private populateData(data: TableContents): HTMLTemplateResult[] {
    return data.map((dataRows: TableRow) => this.populateDataRow(dataRows));
  }

  private generateTable() {
    return this.populateData(this.contents);
  }

  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edi-table': MyElement;
  }
}

// const generateCells = (dataRow: TableRow, rowIndex: number, isHeader = false) => {
//   const isContentEditable = isHeader ? areHeadersEditable : true;
//   return dataRow.map((cellText: string, columnIndex: number) => {
//     const isDefaultValue = typeof defaultValue !== 'undefined' && cellText === defaultValue;
//     return (
//       <div
//         className={`row-${rowIndex}-column-${columnIndex} cell ${isDefaultValue ? defaultValueClassName : ''}`}
//         key={columnIndex}
//         contentEditable={isContentEditable}
//         onInput={updateCellOnInput}
//         onPaste={updateCellsOnPaste}
//         onMouseDown={(e) => (isDefaultValue ? updateCellTextUsingSpecificValue(e.target as HTMLElement, '') : {})}
//         onBlur={(e) => onCellBlur(e)}
//         suppressContentEditableWarning={true}
//       >
//         {cellText}
//       </div>
//     );
//   });
// };

// const populateDataRow = (dataRow: TableRow, rowIndex: number, isHeader = false): JSX.Element => {
//   return (
//     <div className="row" key={rowIndex}>
//       {generateCells(dataRow, rowIndex, isHeader)}
//     </div>
//   );
// };

// const populateData = (data: TableContents): JSX.Element[] => {
//   return data.map((dataRows: TableRow, rowIndex: number) => populateDataRow(dataRows, rowIndex + 1));
// };
