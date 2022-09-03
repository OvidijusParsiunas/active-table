import {UpdateCellsViaCSVOnPaste} from './utils/pasteCSV/updateCellsViaCSVOnPaste';
import {NumberOfIdenticalHeaderText} from './utils/numberOfIdenticalHeaderText';
import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {TableContents, TableRow} from './types/tableContents';
import {LitElement, html, HTMLTemplateResult} from 'lit';

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
    converter: LITElementTypeConverters.convertToBoolean,
  })
  areHeadersEditable = true;

  @property({
    type: Boolean,
    converter: LITElementTypeConverters.convertToBoolean,
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

  // if target used, its textContent is going to be updated
  private updateCell(newText: string | undefined, rowIndex: number, columnIndex: number, target?: HTMLElement): void {
    if (!newText) return;
    this.contents[rowIndex][columnIndex] = newText;
    if (target) target.textContent = newText;
    this.onCellUpdate(newText, rowIndex, columnIndex);
    this.onTableUpdate(this.contents);
  }

  // prettier-ignore
  private updateCellWithPreprocessing(
      newText: string | null, rowIndex: number, columnIndex: number, target?: HTMLElement): void {
    const processedText = newText?.trim();
    this.updateCell(processedText, rowIndex, columnIndex, target)
  }

  private pasteCell = (event: ClipboardEvent, rowIndex: number, columnIndex: number) => {
    const clipboardText = JSON.stringify(event.clipboardData?.getData('text/plain'));
    if (UpdateCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      UpdateCellsViaCSVOnPaste.update(clipboardText, event, rowIndex, columnIndex, this);
    } else {
      this.updateCellWithPreprocessing((event.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  };

  private blurCell(target: HTMLElement, rowIndex: number, columnIndex: number) {
    const cellText = target.textContent?.trim();
    if (cellText !== undefined) {
      if (
        (this.defaultValue !== '' && cellText === '') ||
        (rowIndex === 0 &&
          !this.duplicateHeadersAllowed &&
          NumberOfIdenticalHeaderText.get(cellText, this.contents[0]) > 1)
      ) {
        this.updateCell(this.defaultValue, rowIndex, columnIndex, target);
      }
    }
  }

  private inputCell(event: InputEvent, rowIndex: number, columnIndex: number) {
    if (event.inputType !== 'insertFromPaste') {
      this.updateCellWithPreprocessing((event.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  }

  private generateCells(dataRow: TableRow, rowIndex: number, isHeader: boolean): HTMLTemplateResult[] {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      const isContentEditable = isHeader ? !!this.areHeadersEditable : true;
      const newRowIndex = isHeader ? 0 : rowIndex + 1;
      // https://lit.dev/docs/localization/best-practices
      // check if this is re-rendered when a text value is changed
      return html`<div
        class="cell"
        contenteditable=${isContentEditable}
        @input=${(e: InputEvent) => this.inputCell(e, newRowIndex, columnIndex)}
        @blur=${(e: FocusEvent) => this.blurCell(e.target as HTMLElement, newRowIndex, columnIndex)}
        @paste=${(e: ClipboardEvent) => this.pasteCell(e, newRowIndex, columnIndex)}
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
