import {CellDropdownItems, ColumnUpdateDetails} from '../../types/onUpdate';
import {ColumnDetailsT, ColumnsDetailsT} from '../../types/columnDetails';
import {CellDropdownI} from '../../types/cellDropdownInternal';
import {ColumnsByWidth} from '../../types/columnsByWidth';

export class ColumnDetailsUtils {
  public static getColumnsByWidth(columnsDetails: ColumnsDetailsT): ColumnsByWidth {
    const dynamicWidth: ColumnsDetailsT = [];
    const staticWidth: ColumnsDetailsT = [];
    for (let i = 0; i < columnsDetails.length; i += 1) {
      const columnDetails = columnsDetails[i];
      if (columnDetails.settings.widths?.staticWidth !== undefined) {
        staticWidth.push(columnDetails);
      } else {
        dynamicWidth.push(columnDetails);
      }
    }
    return {dynamicWidth, staticWidth};
  }

  private static aggregateItems(cellDropdown: CellDropdownI): CellDropdownItems {
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
      updateDetails.cellDropdownItems = ColumnDetailsUtils.aggregateItems(columnDetails.cellDropdown);
    }
    columnDetails.onColumnUpdate(updateDetails);
  }
}
