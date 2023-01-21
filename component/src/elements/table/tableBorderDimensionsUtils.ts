import {TableBorderDimensions} from '../../types/tableBorderDimensions';

export class TableBorderDimensionsUtils {
  public static generateDefault(): TableBorderDimensions {
    return {
      leftWidth: 0,
      rightWidth: 0,
      topWidth: 0,
      bottomWidth: 0,
    };
  }

  private static getWidth(element: HTMLElement, cssProperty: keyof CSSStyleDeclaration) {
    if (element.style[cssProperty] === '') return 1;
    return Number.parseFloat(element.style[cssProperty] as string) || 0;
  }

  public static generateUsingElement(tableElement: HTMLElement) {
    return {
      leftWidth: TableBorderDimensionsUtils.getWidth(tableElement, 'borderLeftWidth'),
      rightWidth: TableBorderDimensionsUtils.getWidth(tableElement, 'borderRightWidth'),
      topWidth: TableBorderDimensionsUtils.getWidth(tableElement, 'borderTopWidth'),
      bottomWidth: TableBorderDimensionsUtils.getWidth(tableElement, 'borderBottomWidth'),
    };
  }
}
