import {GenericElementUtils} from '../../utils/elements/genericElementUtils';
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

  public static generateUsingElement(tableElement: HTMLElement) {
    return {
      leftWidth: GenericElementUtils.getStyleWidth(tableElement, 'borderLeftWidth'),
      rightWidth: GenericElementUtils.getStyleWidth(tableElement, 'borderRightWidth'),
      topWidth: GenericElementUtils.getStyleWidth(tableElement, 'borderTopWidth'),
      bottomWidth: GenericElementUtils.getStyleWidth(tableElement, 'borderBottomWidth'),
    };
  }
}
