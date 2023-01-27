import {NoDimensionCSSStyle, StatefulCSSS} from '../../types/cssStyle';
import {GenericObject} from '../../types/genericObject';

export class ElementStyle {
  public static unsetStyle(element: HTMLElement, style: NoDimensionCSSStyle) {
    const unsetStyles = Object.keys(style).reduce<GenericObject>((obj, styleName) => {
      obj[styleName] = '';
      return obj;
    }, {});
    Object.assign(element.style, unsetStyles);
  }

  public static unsetAllCSSStates(buttonElement: HTMLElement, statefulStyle: StatefulCSSS) {
    if (statefulStyle.click) ElementStyle.unsetStyle(buttonElement, statefulStyle.click);
    if (statefulStyle.hover) ElementStyle.unsetStyle(buttonElement, statefulStyle.hover);
    if (statefulStyle.default) ElementStyle.unsetStyle(buttonElement, statefulStyle.default);
  }
}
