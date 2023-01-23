import {TableBorderDimensions} from '../../types/tableBorderDimensions';
import {Browser} from '../browser/browser';

// this class is used to augment the offset by the browser as safari and firefox calculate them differently
// ONLY for elements inside the table
export class ElementOffset {
  public static processLeft(offset: number, borderDimensions: TableBorderDimensions) {
    if (Browser.IS_FIREFOX) {
      offset += borderDimensions.leftWidth;
    } else if (Browser.IS_SAFARI) {
      offset -= borderDimensions.leftWidth;
    }
    return offset;
  }

  public static processTop(offset: number, borderDimensions: TableBorderDimensions) {
    if (Browser.IS_FIREFOX) {
      offset += borderDimensions.topWidth;
    } else if (Browser.IS_SAFARI) {
      offset -= borderDimensions.topWidth;
    }
    return offset;
  }

  public static processWidth(offset: number, borderDimensions: TableBorderDimensions) {
    if (Browser.IS_FIREFOX) offset += borderDimensions.leftWidth;
    return offset;
  }
}
