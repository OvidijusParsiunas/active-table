import {UpdateCellsViaCSVOnPaste} from './utils/pasteCSV/updateCellsViaCSVOnPaste';
import {NumberOfIdenticalHeaderText} from './utils/numberOfIdenticalHeaderText';
import {LITElementTypeConverters} from './utils/LITElementTypeConverters';
import {customElement, property, state} from 'lit/decorators.js';
import {ediTableStyle} from './editable-table-component-style';
import {TableContents, TableRow} from './types/tableContents';
import {createRef, ref, Ref} from 'lit/directives/ref.js';
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

  // WORK - use this more
  // WORK - is this available publically
  dataRef: Ref<HTMLInputElement> = createRef();

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

  private pasteOnCell(event: ClipboardEvent, rowIndex: number, columnIndex: number) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData('text/plain'));
    if (UpdateCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      UpdateCellsViaCSVOnPaste.update(clipboardText, event, rowIndex, columnIndex, this);
    } else {
      this.updateCellWithPreprocessing((event.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  }

  private blurOnCell(target: HTMLElement, rowIndex: number, columnIndex: number) {
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

  private inputOnCell(event: InputEvent, rowIndex: number, columnIndex: number) {
    if (event.inputType !== 'insertFromPaste') {
      this.updateCellWithPreprocessing((event.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  }

  private createCells(dataRow: TableRow, rowIndex: number, isHeader: boolean): HTMLTemplateResult[] {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      const isContentEditable = isHeader ? !!this.areHeadersEditable : true;
      const newRowIndex = isHeader ? 0 : rowIndex + 1;
      // https://lit.dev/docs/localization/best-practices
      // check if this is re-rendered when a text value is changed
      const myElement = html`<div
        class="cell"
        contenteditable=${isContentEditable}
        @input=${(e: InputEvent) => this.inputOnCell(e, newRowIndex, columnIndex)}
        @blur=${(e: FocusEvent) => this.blurOnCell(e.target as HTMLElement, newRowIndex, columnIndex)}
        @paste=${(e: ClipboardEvent) => this.pasteOnCell(e, newRowIndex, columnIndex)}
      >
        ${cellText}
      </div>`;
      return myElement;
    });
  }

  private createDataRow(dataRow: TableRow, rowIndex: number, isHeader = false): HTMLTemplateResult {
    return html`<div class="row">${this.createCells(dataRow, rowIndex, isHeader)}</div>`;
  }

  // WORK - see if this can be done for all
  private inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType !== 'insertFromPaste') {
      this.updateCellWithPreprocessing((inputEvent.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  }

  private blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const target = event.target as HTMLElement;
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

  private pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData('text/plain'));
    if (UpdateCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      UpdateCellsViaCSVOnPaste.update(clipboardText, event, rowIndex, columnIndex, this);
    } else {
      this.updateCellWithPreprocessing((event.target as HTMLElement).textContent, rowIndex, columnIndex);
    }
  }

  private createCellNodes(dataRow: TableRow, rowIndex: number, isHeader: boolean) {
    return dataRow.map((cellText: string | number, columnIndex: number) => {
      const isContentEditable = isHeader ? !!this.areHeadersEditable : true;
      const div = document.createElement('div');
      div.classList.add('cell');
      div.contentEditable = String(isContentEditable);
      div.textContent = cellText as string;
      div.oninput = this.inputCell.bind(this, rowIndex, columnIndex);
      div.onblur = this.blurCell.bind(this, rowIndex, columnIndex);
      div.onpaste = this.pasteCell.bind(this, rowIndex, columnIndex);
      return div;
    });
  }

  private createDataRowNode(dataRow: TableRow, rowIndex: number, isHeader = false) {
    const cellNodes = this.createCellNodes(dataRow, rowIndex, isHeader);
    const div = document.createElement('div');
    div.classList.add('row');
    cellNodes.forEach((node) => {
      div.appendChild(node);
    });
    return div;
  }

  private populateData(data: TableContents): HTMLTemplateResult[] {
    return data.map((dataRows: TableRow, rowIndex: number) => this.createDataRow(dataRows, rowIndex));
  }

  private addNewRow() {
    const numberOfColumns = this.contents[0].length;
    const newRowData = new Array(numberOfColumns).fill(this.defaultValue);
    this.contents.push(newRowData);
    newRowData.forEach((cellText: string, columnIndex: number) => {
      this.onCellUpdate(cellText, this.contents.length - 1, columnIndex);
    });
    this.onTableUpdate(this.contents);
    const newRowNode = this.createDataRowNode(newRowData, this.contents.length - 1);
    if (this.dataRef.value) {
      this.dataRef.value.appendChild(newRowNode);
    }
  }

  private createAddRowElement() {
    return html` <div class="add-new-row-row row" @click=${this.addNewRow}>
      <div class="add-new-row-cell cell">+ New</div>
    </div>`;
  }

  private generateTable() {
    return html`
      <div class="header">${this.createDataRow(this.contents[0], 0, true)}</div>
      <div class="data" ${ref(this.dataRef)}>${this.populateData(this.contents.slice(1))}</div>
      ${this.createAddRowElement()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-table-component': EditableTableComponent;
  }
}
// onMouseDown={(e) => (isDefaultValue ? updateCellTextUsingSpecificValue(e.target as HTMLElement, '') : {})}
