import {OverwriteCellsViaCSVOnPaste} from '../../utils/pasteCSV/overwriteCellsViaCSVOnPaste';
import {EditableTableComponent} from '../../editable-table-component';
import {ElementSet} from '../../types/elementSet';
import {CellEvents} from './cellEvents';

export class DataCellEvents {
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
  private static inputCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent.inputType !== DataCellEvents.PASTE_INPUT_TYPE) {
      const cellElement = inputEvent.target as HTMLElement;
      CellEvents.updateCell(this, cellElement.textContent as string, rowIndex, columnIndex);
      // WORK - this may not be required
      if (rowIndex === 0) {
        // reason why using visibleColumnSizers property instead of getting column sizers via columnDetails and columnIndex
        // is because the user could have hovered over another header cell other than the one that is being typed in
        DataCellEvents.updateVisibleColumnSizerHeight(this.overlayElementsState.visibleColumnSizers, cellElement);
      }
    }
  }

  private static pasteCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: ClipboardEvent) {
    const clipboardText = JSON.stringify(event.clipboardData?.getData(DataCellEvents.TEXT_DATA_FORMAT));
    if (OverwriteCellsViaCSVOnPaste.isCSVData(clipboardText)) {
      OverwriteCellsViaCSVOnPaste.overwrite(this, clipboardText, event, rowIndex, columnIndex);
    } else {
      const cellElement = event.target as HTMLElement;
      setTimeout(() => {
        CellEvents.updateCell(this, cellElement.textContent as string, rowIndex, columnIndex, {processText: false});
      });
    }
  }

  private static blurCell(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const cellElement = event.target as HTMLElement;
    CellEvents.setCellToDefaultIfNeeded(this, rowIndex, columnIndex, cellElement);
  }

  public static set(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    cellElement.oninput = DataCellEvents.inputCell.bind(etc, rowIndex, columnIndex);
    cellElement.onpaste = DataCellEvents.pasteCell.bind(etc, rowIndex, columnIndex);
    cellElement.onblur = DataCellEvents.blurCell.bind(etc, rowIndex, columnIndex);
    cellElement.onfocus = CellEvents.removeTextIfCellDefault.bind(etc, rowIndex, columnIndex);
  }
}
