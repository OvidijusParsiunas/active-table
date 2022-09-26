import {CellTypeTotalsUtils} from '../cellTypeTotals/cellTypeTotalsUtils';
import {ColumnDetailsTPartial} from '../../types/columnDetails';
import {COLUMN_TYPE} from '../../enums/cellType';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement): ColumnDetailsTPartial {
    return {
      elements: [cellElement],
      columnType: CellTypeTotalsUtils.DEFAULT_COLUMN_TYPE,
      userChosenColumnType: COLUMN_TYPE.Auto,
      cellTypeTotals: CellTypeTotalsUtils.createObj(),
    };
  }
}
