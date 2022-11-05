import {TableDimensions} from '../../types/tableDimensions';

export class StaticTable {
  public static isTableAtMaxWidth(tableElement: HTMLElement, tableDimensions: TableDimensions): boolean {
    return tableDimensions.maxWidth !== undefined && tableDimensions.maxWidth <= tableElement.offsetWidth + 2;
  }

  public static isStaticTableWidth(tableElement: HTMLElement, tableDimensions: TableDimensions): boolean {
    return tableDimensions.width !== undefined || StaticTable.isTableAtMaxWidth(tableElement, tableDimensions);
  }

  public static updateTableDimensionsProps(tableDimensions: TableDimensions) {
    // width and maxWidth are mutually exclusive and if both are present width is the only one that is used
    if (tableDimensions.width !== undefined && tableDimensions.maxWidth !== undefined) {
      delete tableDimensions.maxWidth;
    }
  }
}
