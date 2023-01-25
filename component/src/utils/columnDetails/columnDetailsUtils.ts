import {ColumnDetailsT, ColumnsDetailsT, SelectDropdownI} from '../../types/columnDetails';
import {ColumUpdateItems, ColumnUpdateDetails} from '../../types/onUpdate';
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

  private static aggregateItems(selectDropdown: SelectDropdownI): ColumUpdateItems {
    return selectDropdown.labelDetails
      ? Object.keys(selectDropdown.itemsDetails).map((text) => {
          return {name: text, backgroundColor: selectDropdown.itemsDetails[text].backgroundColor};
        })
      : Object.keys(selectDropdown.itemsDetails).map((text) => {
          return {name: text};
        });
  }

  public static fireUpdateEvent(columnDetails: ColumnDetailsT) {
    const updateDetails: ColumnUpdateDetails = {
      columnIndex: columnDetails.index,
      typeName: columnDetails.activeType.name,
    };
    if (columnDetails.activeType.selectProps) {
      updateDetails.items = ColumnDetailsUtils.aggregateItems(columnDetails.selectDropdown);
    }
    columnDetails.onColumnUpdate(updateDetails);
  }
}
