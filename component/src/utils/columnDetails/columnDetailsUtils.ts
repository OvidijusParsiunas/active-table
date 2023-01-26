import {ColumUpdateItems, ColumnUpdateDetails} from '../../types/onUpdate';
import {ColumnDetailsT, ColumnsDetailsT} from '../../types/columnDetails';
import {CellDropdownI} from '../../types/cellDropdownInternal';
import {FilteredColumns} from '../../types/filteredColumns';

export class ColumnDetailsUtils {
  public static getFilteredColumns(columnsDetails: ColumnsDetailsT): FilteredColumns {
    const dynamicWidthColumns: ColumnsDetailsT = [];
    const minWidthColumns: ColumnsDetailsT = [];
    const setWidthColumns: ColumnsDetailsT = [];
    for (let i = 0; i < columnsDetails.length; i += 1) {
      const columnDetails = columnsDetails[i];
      if (columnDetails.settings.width !== undefined) {
        setWidthColumns.push(columnDetails);
      } else if (columnDetails.settings.minWidth !== undefined) {
        minWidthColumns.push(columnDetails);
      } else {
        dynamicWidthColumns.push(columnDetails);
      }
    }
    return {dynamicWidthColumns, minWidthColumns, setWidthColumns};
  }

  private static aggregateItems(cellDropdown: CellDropdownI): ColumUpdateItems {
    return cellDropdown.labelDetails
      ? Object.keys(cellDropdown.itemsDetails).map((text) => {
          return {name: text, backgroundColor: cellDropdown.itemsDetails[text].backgroundColor};
        })
      : Object.keys(cellDropdown.itemsDetails).map((text) => {
          return {name: text};
        });
  }

  public static fireUpdateEvent(columnDetails: ColumnDetailsT) {
    const updateDetails: ColumnUpdateDetails = {
      columnIndex: columnDetails.index,
      typeName: columnDetails.activeType.name,
    };
    if (columnDetails.activeType.cellDropdownProps) {
      updateDetails.items = ColumnDetailsUtils.aggregateItems(columnDetails.cellDropdown);
    }
    columnDetails.onColumnUpdate(updateDetails);
  }
}
