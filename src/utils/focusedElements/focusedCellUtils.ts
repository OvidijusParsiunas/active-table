import {CellTypeTotalsUtils} from '../cellType/cellTypeTotalsUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {FocusedCell} from '../../types/focusedCell';
import {ColumnTypes} from '../../types/columnType';

export class FocusedCellUtils {
  public static createEmpty(): FocusedCell {
    return {};
  }

  public static setHeaderCell(focusedCell: FocusedCell, cell: HTMLElement, columnIndex: number) {
    focusedCell.element = cell;
    focusedCell.rowIndex = 0;
    focusedCell.columnIndex = columnIndex;
    delete focusedCell.typeName;
  }

  public static setIndexCell(focusedCell: FocusedCell, cell: HTMLElement, rowIndex: number) {
    focusedCell.element = cell;
    focusedCell.rowIndex = rowIndex;
    delete focusedCell.columnIndex;
    delete focusedCell.typeName;
  }

  // prettier-ignore
  public static set(focusedCell: FocusedCell, cellElement: HTMLElement, rowIndex: number, columnIndex: number,
      types: ColumnTypes) {
    focusedCell.element = cellElement;
    focusedCell.rowIndex = rowIndex;
    focusedCell.columnIndex = columnIndex;
    focusedCell.typeName = CellTypeTotalsUtils.parseTypeName(CellElement.getText(focusedCell.element), types);
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
    delete focusedCell.typeName;
  }
}
