import {UpdateCellsViaCSVOnPaste} from '../../utils/pasteCSV/updateCellsViaCSVOnPaste';
import {NumberOfIdenticalCells} from '../../utils/numberOfIdenticalCells';
import {EditableTableComponent} from '../../editable-table-component';
import {CELL_UPDATE_TYPE} from '../../enums/onUpdateCellType';
import {ColumnSizerEvents} from './columnSizerEvents';

export class CellEvents {
  private static readonly EMPTY_STRING = '';
  private static readonly PASTE_INPUT_TYPE = 'insertFromPaste';
  private static readonly TEXT_DATA_FORMAT = 'text/plain';

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
    CellEvents.updateCell(etc, processedText, rowIndex, columnIndex, target);
  }

  public static inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType !== CellEvents.PASTE_INPUT_TYPE) {
      const target = inputEvent.target as HTMLElement;
      CellEvents.updateCellWithPreprocessing(this, target.textContent, rowIndex, columnIndex);
    }
  }

  public static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData(CellEvents.TEXT_DATA_FORMAT));
    if (UpdateCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      UpdateCellsViaCSVOnPaste.update(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const {textContent} = event.target as HTMLElement;
      CellEvents.updateCellWithPreprocessing(this, textContent, rowIndex, columnIndex);
    }
  }

  public static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const target = event.target as HTMLElement;
    const cellText = target.textContent?.trim();
    if (cellText !== undefined) {
      if (
        (this.defaultCellValue !== CellEvents.EMPTY_STRING && cellText === CellEvents.EMPTY_STRING) ||
        (rowIndex === 0 && !this.duplicateHeadersAllowed && NumberOfIdenticalCells.get(cellText, this.contents[0]) > 1)
      ) {
        CellEvents.updateCell(this, this.defaultCellValue, rowIndex, columnIndex, target);
      }
    }
  }

  // prettier-ignore
  public static focusCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    if (this.defaultCellValue !== CellEvents.EMPTY_STRING
        && this.defaultCellValue === (event.target as HTMLElement).textContent) {
      CellEvents.updateCell(this, CellEvents.EMPTY_STRING, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  public static mouseEnterCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: MouseEvent) {
    if (rowIndex === 0) ColumnSizerEvents.cellMouseEnter(this.overlayElements.columnSizers, columnIndex, event);
  }

  public static mouseLeaveCell(this: EditableTableComponent, rowIndex: number, columnIndex: number) {
    if (rowIndex === 0) ColumnSizerEvents.cellMouseLeave(this.overlayElements.columnSizers, columnIndex);
  }
}
