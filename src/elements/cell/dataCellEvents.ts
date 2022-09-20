import {OverwriteCellsViaCSVOnPaste} from '../../utils/pasteCSV/overwriteCellsViaCSVOnPaste';
import {NumberOfIdenticalCells} from '../../utils/numberOfIdenticalCells';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {ElementSet} from '../../types/elementSet';

export class DataCellEvents {
  private static readonly EMPTY_STRING = '';
  private static readonly PASTE_INPUT_TYPE = 'insertFromPaste';
  private static readonly TEXT_DATA_FORMAT = 'text/plain';

  private static updateVisibleColumnSizerHeight(visibleSizers: ElementSet, target: HTMLElement) {
    // placed in a timeout to save up on performance
    setTimeout(() => {
      const newHeight = `${target.offsetHeight}px`;
      visibleSizers.forEach((columnSizer) => (columnSizer.style.height = newHeight));
    });
  }

  // prettier-ignore
  private static updateCell(etc: EditableTableComponent,
      newText: string | undefined, rowIndex: number, columnIndex: number, target?: HTMLElement): void {
    if (newText === undefined || newText === null) return;
    etc.contents[rowIndex][columnIndex] = newText;
    if (target) target.textContent = newText;
    etc.onCellUpdate(newText, rowIndex, columnIndex, CELL_UPDATE_TYPE.UPDATE);
    etc.onTableUpdate(etc.contents);
  }

  // prettier-ignore
  private static updateCellWithPreprocessing(etc: EditableTableComponent,
      newText: string | null, rowIndex: number, columnIndex: number, target?: HTMLElement): void {
    const processedText = newText?.trim();
    DataCellEvents.updateCell(etc, processedText, rowIndex, columnIndex, target);
  }

  private static inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType !== DataCellEvents.PASTE_INPUT_TYPE) {
      const target = inputEvent.target as HTMLElement;
      DataCellEvents.updateCellWithPreprocessing(this, target.textContent, rowIndex, columnIndex);
      // WORK - this may not be required
      if (rowIndex === 0) {
        // reason why using visibleColumnSizers property instead of getting column sizers via columnDetails and columnIndex
        // is because the user could have hovered over another header cell other than the one that is being typed in
        DataCellEvents.updateVisibleColumnSizerHeight(this.overlayElementsState.visibleColumnSizers, target);
      }
    }
  }

  private static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData(DataCellEvents.TEXT_DATA_FORMAT));
    if (OverwriteCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      OverwriteCellsViaCSVOnPaste.overwrite(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const {textContent} = event.target as HTMLElement;
      DataCellEvents.updateCellWithPreprocessing(this, textContent, rowIndex, columnIndex);
    }
  }

  // WORK - duplicate headers allowed
  private static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const target = event.target as HTMLElement;
    const cellText = target.textContent?.trim();
    if (cellText !== undefined) {
      if (
        (this.defaultCellValue !== DataCellEvents.EMPTY_STRING && cellText === DataCellEvents.EMPTY_STRING) ||
        (rowIndex === 0 && !this.duplicateHeadersAllowed && NumberOfIdenticalCells.get(cellText, this.contents[0]) > 1)
      ) {
        DataCellEvents.updateCell(this, this.defaultCellValue, rowIndex, columnIndex, target);
      }
    }
  }

  // prettier-ignore
  private static focusCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    if (this.defaultCellValue !== DataCellEvents.EMPTY_STRING
        && this.defaultCellValue === (event.target as HTMLElement).textContent) {
      DataCellEvents.updateCell(this, DataCellEvents.EMPTY_STRING, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  public static set(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.oninput = DataCellEvents.inputCell.bind(etc, rowIndex, columnIndex);
    cellElement.onpaste = DataCellEvents.pasteCell.bind(etc, rowIndex, columnIndex);
    cellElement.onblur = DataCellEvents.blurCell.bind(etc, rowIndex, columnIndex);
    cellElement.onfocus = DataCellEvents.focusCell.bind(etc, rowIndex, columnIndex);
  }
}
