import {TableDimensionsInternal} from '../../../types/tableDimensionsInternal';

export class StaticTable {
  // because we don't set the table width for maxWidth property, its width is made up of columns widths -
  // they don't always add up to a precise expected value, e.g. if expected 500, they can add up to a 498
  // and 499. Hence instead of doing === tableElement.offsetWidth, we do <= tableElement.offsetWidth + 2
  // number 2 seems enough but can increase if this method is returning false in valid scenarios
  public static isTableAtMaxWidth(tableElement: HTMLElement, tableDimensions: TableDimensionsInternal): boolean {
    return tableDimensions.maxWidth !== undefined && tableDimensions.maxWidth <= tableElement.offsetWidth + 2;
  }

  public static isStaticTableWidth(tableElement: HTMLElement, tableDimensions: TableDimensionsInternal): boolean {
    return tableDimensions.width !== undefined || StaticTable.isTableAtMaxWidth(tableElement, tableDimensions);
  }
}
