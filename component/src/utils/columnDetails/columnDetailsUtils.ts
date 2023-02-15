import {CellDropdownItems, ColumnUpdateDetails} from '../../types/onUpdate';
import {ColumnDetailsT, ColumnsDetailsT} from '../../types/columnDetails';
import {_CellDropdown} from '../../types/cellDropdownInternal';
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

  private static aggregateItems(cellDropdown: _CellDropdown): CellDropdownItems {
    return cellDropdown.labelDetails
      ? Object.keys(cellDropdown.itemsDetails).map((text) => {
          return {name: text, backgroundColor: cellDropdown.itemsDetails[text].backgroundColor};
        })
      : Object.keys(cellDropdown.itemsDetails).map((text) => {
          return {name: text};
        });
  }

  private static getDetails(columnDetails: ColumnDetailsT) {
    const updateDetails: ColumnUpdateDetails = {
      width: columnDetails.elements[0].offsetWidth,
      typeName: columnDetails.activeType.name,
    };
    if (columnDetails.activeType.cellDropdownProps) {
      updateDetails.cellDropdownItems = ColumnDetailsUtils.aggregateItems(columnDetails.cellDropdown);
    }
    return updateDetails;
  }

  public static getAllColumnsDetails(columnsDetails: ColumnsDetailsT) {
    return columnsDetails.map((columnDetails) => ColumnDetailsUtils.getDetails(columnDetails));
  }
}
