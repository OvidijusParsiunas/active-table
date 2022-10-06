import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {FocusedCell} from '../../types/focusedCell';

export class FocusedCellUtils {
  public static createEmpty(): FocusedCell {
    return {};
  }

  public static setHeaderCell(focusedCell: FocusedCell, cell: HTMLElement, columnIndex: number) {
    focusedCell.element = cell;
    focusedCell.rowIndex = 0;
    focusedCell.columnIndex = columnIndex;
    delete focusedCell.type;
  }

  // prettier-ignore
  public static set(focusedCell: FocusedCell, cellElement: HTMLElement, rowIndex: number, columnIndex: number,
      defaultCellValue: string) {
    focusedCell.element = cellElement;
    focusedCell.rowIndex = rowIndex;
    focusedCell.columnIndex = columnIndex;
    focusedCell.type = CellTypeTotalsUtils.parseType(focusedCell.element.textContent as string, defaultCellValue);
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
    delete focusedCell.type;
  }
}
