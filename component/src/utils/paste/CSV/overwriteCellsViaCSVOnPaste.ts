import {InsertMatrix} from '../../insertRemoveStructure/insert/insertMatrix';
import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {ParseCSVClipboardText} from './parseCSVClipboardText';
import {FocusedCell} from '../../../types/focusedCell';
import {ActiveTable} from '../../../activeTable';

export class OverwriteCellsViaCSVOnPaste {
  private static focusOriginalCellAfterProcess(at: ActiveTable, process: () => void) {
    const {element, rowIndex, columnIndex} = at._focusedElements.cell as Required<FocusedCell>;
    process();
    FocusedCellUtils.set(at._focusedElements.cell, element, rowIndex, columnIndex);
  }

  // prettier-ignore
  public static overwrite(at: ActiveTable,
      clipboardText: string, event: ClipboardEvent, rowIndex: number, columnIndex: number,) {
    event.preventDefault();
    const CSV = ParseCSVClipboardText.parse(clipboardText);
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
