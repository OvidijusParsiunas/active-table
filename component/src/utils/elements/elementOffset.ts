import {TableElement} from '../../elements/table/tableElement';
import {Browser} from '../browser/browser';

// this class is used to augment the offset by the browser as safari and firefox calculate them differently
// ONLY for elements inside the table
export class ElementOffset {
  public static processLeft(offset: number) {
    if (Browser.IS_FIREFOX) {
      offset += TableElement.BORDER_DIMENSIONS.leftWidth;
    } else if (Browser.IS_SAFARI) {
      offset -= TableElement.BORDER_DIMENSIONS.leftWidth;
    }
    return offset;
  }

  public static processTop(offset: number) {
    if (Browser.IS_FIREFOX) {
      offset += TableElement.BORDER_DIMENSIONS.topWidth;
    } else if (Browser.IS_SAFARI) {
      offset -= TableElement.BORDER_DIMENSIONS.topWidth;
    }
    return offset;
  }

  public static processWidth(offset: number) {
    if (Browser.IS_FIREFOX) offset += TableElement.BORDER_DIMENSIONS.leftWidth;
    return offset;
  }
}
