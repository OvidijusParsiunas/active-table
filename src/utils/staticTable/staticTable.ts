import {TableDimensions} from '../../types/tableDimensions';

export class StaticTable {
  public static isTableAtMaxWidth(tableElement: HTMLElement, tableDimensions: TableDimensions): boolean {
    return !!(
      tableDimensions.width === undefined &&
      tableDimensions.maxWidth &&
      tableDimensions.maxWidth <= tableElement.offsetWidth + 2
    );
  }

  public static isStaticTableWidth(tableElement: HTMLElement, tableDimensions: TableDimensions): boolean {
    return tableDimensions.width !== undefined || StaticTable.isTableAtMaxWidth(tableElement, tableDimensions);
  }
}
