import {FilteredColumns} from '../../types/filteredColumns';
import {ColumnsDetailsT} from '../../types/columnDetails';

export class ColumnDetailsUtils {
  public static getFilteredColumns(columnsDetails: ColumnsDetailsT): FilteredColumns {
    const dynamicWidthColumns: ColumnsDetailsT = [];
    const minWidthColumns: ColumnsDetailsT = [];
    const setWidthColumns: ColumnsDetailsT = [];
    for (let i = 0; i < columnsDetails.length; i += 1) {
      const columnDetails = columnsDetails[i];
      if (columnDetails.settings?.width !== undefined) {
        setWidthColumns.push(columnDetails);
      } else if (columnDetails.settings?.minWidth !== undefined) {
        minWidthColumns.push(columnDetails);
      } else {
        dynamicWidthColumns.push(columnDetails);
      }
    }
    return {dynamicWidthColumns, minWidthColumns, setWidthColumns};
  }
}
