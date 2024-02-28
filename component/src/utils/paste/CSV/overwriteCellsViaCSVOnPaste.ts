import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {InsertMatrix} from '../../programmaticUpdates/insertMatrix';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {FocusedCell} from '../../../types/focusedCell';
import {TableData} from '../../../types/tableData';
import {ActiveTable} from '../../../activeTable';

export class OverwriteCellsViaCSVOnPaste {
  private static trimCSVRowsIfPaginationAsync(CSV: TableData, data: TableData, rowIndex: number, columnIndex: number) {
    const endRowIndex = CSV.length + rowIndex;
    if (data.length < endRowIndex) {
      CSV = CSV.slice(0, CSV.length - (endRowIndex - data.length));
    }
    const columnNumber = data[0]?.length || 0;
    const endColumnIndex = CSV[0].length + columnIndex;
    if (columnNumber < endColumnIndex) {
      const trimIndex = CSV[0].length - (endColumnIndex - columnNumber);
      CSV.forEach((row) => row.splice(trimIndex));
    }
    return CSV;
  }

  private static focusOriginalCellAfterProcess(at: ActiveTable, process: () => void) {
    const {element, rowIndex, columnIndex} = at._focusedElements.cell as Required<FocusedCell>;
    process();
    FocusedCellUtils.set(at._focusedElements.cell, element, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static overwrite(at: ActiveTable,
      clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number) {
    event.preventDefault();
    let CSV = ParseCSVClipboardText.parse(clipboardText);
    if (at._pagination.async) {
      CSV = OverwriteCellsViaCSVOnPaste.trimCSVRowsIfPaginationAsync(CSV, at.data, rowIndex, columnIndex);
    }
    OverwriteCellsViaCSVOnPaste.focusOriginalCellAfterProcess(at,
      InsertMatrix.insert.bind(this, at, CSV, rowIndex, columnIndex));
  }

  public static isCSVData(clipboardText: string): boolean {
    return (
      clipboardText.indexOf(ParseCSVClipboardText.NEW_LINE_SYMBOL) > -1 ||
      clipboardText.indexOf(ParseCSVClipboardText.TAB_SYMBOL) > -1
    );
  }
}
