import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {LitElement, html, HTMLTemplateResult} from 'lit';

type TableRow = (number | string)[];
type TableContents = TableRow[];

// spellcheck can be enabled or disabled by the user - enabled by default
@customElement('editable-table-component')
export class EditableTableComponent extends LitElement {
  static override styles = [ediTableStyle];

  @property({type: Array})
  contents: TableContents = [
    ['R', 'G', 'B', 'Color'],
    [255, 0, 0, 'Red'],
    [254, 0, 0, 'Red'],
    [0, 255, 0, 'Green'],
    [0, 254, 0, 'Green'],
  ];

  // check if types for this work
  @property()
  onCellUpdate: (newText: string, cellRowIndex: number, cellColumnIndex: number) => void = () => {};

  @property()
  onTableUpdate: (newTableContents: TableContents) => void = () => {};

  @property({
    type: Boolean,
    converter: EditableTableComponent.convertToBoolean,
  })
  areHeadersEditable = true;

  @property({
    type: Boolean,
    converter: EditableTableComponent.convertToBoolean,
  })
  duplicateHeadersAllowed = true;

  @state()
  // attempt to use the noAccessor property type or hasChanged property type in order to control what is being refresherd
  _header: string[] = [];

  @property({type: String})
  defaultValue = '';

  override render() {
    // setTimeout(() => {
    //   this.contents = [
    //     [1, 2, 3, 4],
    //     [1, 2, 3, 5],
    //   ];
    // }, 2000);
    return html`<div class="table">${this.generateTable()}</div>`;
  }

  private static convertToBoolean(value: string | null): boolean {
    return typeof value === 'string' ? value === 'true' : Boolean(value);
  }

  private updateTableContent(target: HTMLElement, rowIndex: number, columnIndex: number) {
    const newText = target.textContent?.trim() as string;
    this.contents[rowIndex][columnIndex] = newText;
    this.onCellUpdate(newText, rowIndex, columnIndex);
    this.onTableUpdate(this.contents);
  }

  private updateDefault(target: HTMLElement, rowIndex: number, columnIndex: number) {
    this.contents[rowIndex][columnIndex] = this.defaultValue;
    target.textContent = this.defaultValue;
    this.onCellUpdate(this.defaultValue, rowIndex, columnIndex);
    this.onTableUpdate(this.contents);
  }

  private getNumberOfIdenticalHeaderText(targetHeaderText: string) {
    return this.contents[0].slice(0).filter((headerText) => headerText === targetHeaderText).length;
  }

  private blurCell(target: HTMLElement, rowIndex: number, columnIndex: number) {
    const cellText = target.textContent?.trim();
    if (cellText !== undefined) {
      if (
        (this.defaultValue !== '' && cellText === '') ||
        (rowIndex === 0 && !this.duplicateHeadersAllowed && this.getNumberOfIdenticalHeaderText(cellText) > 1)
      ) {
        this.updateDefault(target, rowIndex, columnIndex);
      }
    }
  }

  private generateCells(dataRow: TableRow, rowIndex: number, isHeader: boolean): HTMLTemplateResult[] {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      const isContentEditable = isHeader ? !!this.areHeadersEditable : true;
      // https://lit.dev/docs/localization/best-practices
      // check if this is re-rendered when a text value is changed
      return html`<div
        class="cell"
        contenteditable=${isContentEditable}
        @input=${(e: InputEvent) => this.updateTableContent(e.target as HTMLElement, rowIndex, columnIndex)}
        @blur=${(e: FocusEvent) => this.blurCell(e.target as HTMLElement, rowIndex, columnIndex)}
      >
        ${cellText}
      </div>`;
    });
  }

  private populateDataRow(dataRow: TableRow, rowIndex: number, isHeader = false): HTMLTemplateResult {
    return html`<div class="row">${this.generateCells(dataRow, rowIndex, isHeader)}</div>`;
  }

  private populateData(data: TableContents): HTMLTemplateResult[] {
    return data.map((dataRows: TableRow, rowIndex: number) => this.populateDataRow(dataRows, rowIndex));
  }

  private generateTable() {
    return html`
      <div class="header">${this.populateDataRow(this.contents[0], 0, true)}</div>
      <div class="data">${this.populateData(this.contents.slice(1))}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-table-component': EditableTableComponent;
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
