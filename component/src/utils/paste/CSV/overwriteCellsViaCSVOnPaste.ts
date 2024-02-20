import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {InsertMatrix} from '../../programmaticUpdates/insertMatrix';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {FocusedCell} from '../../../types/focusedCell';
import {TableData} from '../../../types/tableData';
import {ActiveTable} from '../../../activeTable';

export class OverwriteCellsViaCSVOnPaste {
  private static trimCSVRowsIfCantCreateNew(CSV: TableData, data: TableData, rowIndex: number) {
    if (data.length < CSV.length + rowIndex) {
      return CSV.slice(0, CSV.length - (CSV.length + rowIndex - data.length));
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
    if (!at.displayAddNewRow && at._pagination._async) {
      CSV = OverwriteCellsViaCSVOnPaste.trimCSVRowsIfCantCreateNew(CSV, at.data, rowIndex);
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
