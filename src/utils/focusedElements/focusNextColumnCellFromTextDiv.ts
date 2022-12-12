import {CellWithTextEvents} from '../../elements/cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../editable-table-component';
import {Browser} from '../browser/browser';

export class FocusNextColumnCellFromTextDiv {
  private static focusDifferentColumnCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const {elements, activeType} = etc.columnsDetails[columnIndex];
    const cellElement = elements[rowIndex];
    // FIREFOX does not have contentEditable set prior to focus, but it uses tabIndex to allow the use of tab key
    if (Browser.IS_FIREFOX ? cellElement.tabIndex !== 0 : cellElement.contentEditable === 'false') {
      return FocusNextColumnCellFromTextDiv.focusOrBlurNext(etc, columnIndex, rowIndex);
    }
    if (activeType.categories) {
      // needs to be mousedown in order to set focusedCell
      cellElement.dispatchEvent(new Event('mousedown'));
    } else {
      CellWithTextEvents.programmaticBlur(etc);
      // dispatchEvent(new Event('focus')); does not return a selection in firefox for window.document.getSelection()
      cellElement.focus();
    }
    cellElement.scrollIntoView({block: 'nearest'});
  }

  private static focusOrBlurNextRowFirstCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const firstColumn = etc.columnsDetails[0];
    const nextRowIndex = rowIndex + 1;
    const nextRowFirstCell = firstColumn.elements[nextRowIndex];
    if (nextRowFirstCell) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, 0, nextRowIndex);
    } else {
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (etc.columnsDetails[columnIndex].elements[rowIndex].children[0] as HTMLElement).blur();
    }
  }

  public static focusOrBlurNext(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const nextColumn = etc.columnsDetails[columnIndex + 1];
    if (nextColumn) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, columnIndex + 1, rowIndex);
    } else {
      FocusNextColumnCellFromTextDiv.focusOrBlurNextRowFirstCell(etc, columnIndex, rowIndex);
    }
  }
}
