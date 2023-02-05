import {FocusedCell} from '../../types/focusedCell';

export class FocusedCellUtils {
  public static createEmpty(): FocusedCell {
    return {};
  }

  public static setHeaderCell(focusedCell: FocusedCell, cell: HTMLElement, columnIndex: number) {
    focusedCell.element = cell;
    focusedCell.rowIndex = 0;
    focusedCell.columnIndex = columnIndex;
  }

  public static setIndexCell(focusedCell: FocusedCell, cell: HTMLElement, rowIndex: number) {
    focusedCell.element = cell;
    focusedCell.rowIndex = rowIndex;
    delete focusedCell.columnIndex;
  }

  public static set(focusedCell: FocusedCell, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    focusedCell.element = cellElement;
    focusedCell.rowIndex = rowIndex;
    focusedCell.columnIndex = columnIndex;
  }

  public static incrementColumnIndex(focusedCell: FocusedCell, newColumnIndex: number) {
    if (focusedCell.columnIndex !== undefined && newColumnIndex <= focusedCell.columnIndex) {
      focusedCell.columnIndex += 1;
    }
  }

  public static purge(focusedCell: FocusedCell) {
    delete focusedCell.columnIndex;
    delete focusedCell.element;
    delete focusedCell.rowIndex;
  }
}
