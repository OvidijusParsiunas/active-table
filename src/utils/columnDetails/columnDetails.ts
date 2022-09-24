import {CellTypeTotalsUtils} from '../cellTypeTotals/cellTypeTotalsUtils';
import {ColumnDetailsTPartial} from '../../types/columnDetails';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement): ColumnDetailsTPartial {
    return {
      elements: [cellElement],
      columnType: CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE,
      cellTypeTotals: CellTypeTotalsUtils.createObj(),
    };
  }
}
