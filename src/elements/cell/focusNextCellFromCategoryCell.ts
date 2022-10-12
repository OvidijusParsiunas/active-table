import {EditableTableComponent} from '../../editable-table-component';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {CategoryCellEvents} from './categoryCellEvents';

export class FocusNextCellFromCategoryCell {
  private static focusDifferentColumnCell(etc: EditableTableComponent, cellColumn: ColumnDetailsT, rowIndex: number) {
    const {userSetColumnType, elements} = cellColumn;
    const cellElement = elements[rowIndex];
    if (userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      // needs to be mousedown in order to set focusedCell
      cellElement.dispatchEvent(new Event('mousedown'));
    } else {
      CategoryCellEvents.programmaticBlur(etc);
      cellElement.focus();
    }
  }

  private static focusOrBlurNextRowFirstCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const firstColumn = etc.columnsDetails[0];
    const nextRowIndex = rowIndex + 1;
    const nextRowFirstCell = firstColumn.elements[nextRowIndex];
    if (nextRowFirstCell) {
      FocusNextCellFromCategoryCell.focusDifferentColumnCell(etc, firstColumn, nextRowIndex);
    } else {
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (etc.columnsDetails[columnIndex].elements[rowIndex].children[0] as HTMLElement).blur();
    }
  }

  public static focusOrBlurRowNextCell(etc: EditableTableComponent, columnIndex: number, rowIndex: number) {
    const nextColumn = etc.columnsDetails[columnIndex + 1];
    if (nextColumn) {
      FocusNextCellFromCategoryCell.focusDifferentColumnCell(etc, nextColumn, rowIndex);
    } else {
      FocusNextCellFromCategoryCell.focusOrBlurNextRowFirstCell(etc, columnIndex, rowIndex);
    }
  }

  public static focusOrBlurColumnNextCell(elements: HTMLElement[], rowIndex: number) {
    const nextColumnCell = elements[rowIndex + 1];
    if (nextColumnCell) {
      // needs to be mousedown in order to set focusedCell
      nextColumnCell.dispatchEvent(new Event('mousedown'));
    } else {
      // if no next cell - blur current as the dropdown will be closed but the cursor would otherwise stay
      (elements[rowIndex].children[0] as HTMLElement).blur();
    }
  }
}
