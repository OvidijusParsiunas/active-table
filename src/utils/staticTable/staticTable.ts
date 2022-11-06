import {TableDimensions} from '../../types/tableDimensions';

export class StaticTable {
  // because we don't set the table width for non-safari browsers, their width is made up by columns
  // which does not always add up to the precise round value, e.g. if expected is 500, they can add
  // up to a 498 and 499. Hence instead of doing === tableElement.offsetWidth, we do
  // <= tableElement.offsetWidth + 2
  // number 2 seems enough but can increase if this method is returning false in valid scenarios
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
