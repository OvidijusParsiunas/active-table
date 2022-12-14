import {TableElement} from '../../elements/table/tableElement';
import {Browser} from '../browser/browser';

// this class is used to augment the offset by the browser as safari and firefox calculate them differently
export class ElementOffset {
  public static processLeft(offset: number) {
    if (Browser.IS_FIREFOX) offset += TableElement.BORDER_DIMENSIONS.leftWidth;
    if (Browser.IS_SAFARI) offset -= TableElement.BORDER_DIMENSIONS.leftWidth;
    return offset;
  }

  public static processTop(offset: number) {
    if (Browser.IS_FIREFOX) offset += TableElement.BORDER_DIMENSIONS.topWidth;
    if (Browser.IS_SAFARI) offset -= TableElement.BORDER_DIMENSIONS.topWidth;
    return offset;
  }

  public static processWidth(offset: number) {
    if (Browser.IS_FIREFOX) offset += TableElement.BORDER_DIMENSIONS.leftWidth;
    return offset;
  }
}