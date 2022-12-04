import {CellWithTextEvents} from '../../elements/cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../editable-table-component';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';

export class FocusNextColumnCellFromTextDiv {
  private static focusDifferentColumnCell(etc: EditableTableComponent, cellColumn: ColumnDetailsT, rowIndex: number) {
    const {userSetColumnType, elements, activeType} = cellColumn;
    const cellElement = elements[rowIndex];
    if (activeType.categories || userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
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
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, firstColumn, nextRowIndex);
    } else {
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (etc.columnsDetails[columnIndex].elements[rowIndex].children[0] as HTMLElement).blur();
    }
  }

  public static focusOrBlurNext(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const nextColumn = etc.columnsDetails[columnIndex + 1];
    if (nextColumn) {
      FocusNextColumnCellFromTextDiv.focusDifferentColumnCell(etc, nextColumn, rowIndex);
    } else {
      FocusNextColumnCellFromTextDiv.focusOrBlurNextRowFirstCell(etc, columnIndex, rowIndex);
    }
  }
}
