import {GenericObject} from '../../types/genericObject';
import {CellCSSStyle} from '../../types/cssStyle';

export class ElementStyle {
  public static unsetStyle(element: HTMLElement, style: CellCSSStyle) {
    const unsetStyles = Object.keys(style).reduce<GenericObject>((obj, styleName) => {
      obj[styleName] = '';
      return obj;
    }, {});
    Object.assign(element.style, unsetStyles);
  }
}
