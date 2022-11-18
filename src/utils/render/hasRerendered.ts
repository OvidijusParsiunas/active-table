import {ColumnDetailsT, ColumnsDetailsT} from '../../types/columnDetails';

export class HasRerendered {
  // CAUTION-2
  public static check(columnDetails: ColumnDetailsT): boolean;
  public static check(columnsDetails: ColumnsDetailsT): boolean;
  public static check(columnDetailsObj: ColumnDetailsT | ColumnsDetailsT) {
    if (Array.isArray(columnDetailsObj)) {
      if (columnDetailsObj.length > 0) {
        return !columnDetailsObj[0].cellTypeTotals;
      }
      return false;
    }
    return !columnDetailsObj.cellTypeTotals;
  }
}
