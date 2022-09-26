import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {FocusedCell} from '../../types/focusedCell';

export class FocusedCellUtils {
  public static createEmpty(): FocusedCell {
    return {};
  }

  public static setHeaderCell(focusedCell: FocusedCell, cell: HTMLElement, columnIndex: number) {
    focusedCell.element = cell;
    focusedCell.columnIndex = columnIndex;
    delete focusedCell.type;
  }

  public static setDataCell(focusedCell: FocusedCell, cell: HTMLElement, columnIndex: number, defaultCellValue: string) {
    focusedCell.element = cell;
    focusedCell.columnIndex = columnIndex;
    focusedCell.type = CellTypeTotalsUtils.parseType(focusedCell.element.textContent as string, defaultCellValue);
  }

  public static incrementColumnIndex(focusedCell: FocusedCell, newColumnIndex: number) {
    if (focusedCell.columnIndex !== undefined && newColumnIndex <= focusedCell.columnIndex) {
      focusedCell.columnIndex += 1;
    }
  }
}
