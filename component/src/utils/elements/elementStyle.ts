import {NoDimensionCSSStyle, StatefulCSS} from '../../types/cssStyle';
import {GenericObject} from '../../types/genericObject';

export class ElementStyle {
  public static setStyle(element: HTMLElement, style: string, value: string) {
    (element.style as unknown as GenericObject)[style] = value;
  }

  // prettier-ignore
  public static moveStyles(sourceElement: HTMLElement, destinationElement: HTMLElement,
      ...styles: (keyof CSSStyleDeclaration)[]) {
    styles.forEach((style) => {
      if (sourceElement.style[style]) {
        ElementStyle.setStyle(destinationElement, style as string, sourceElement.style[style] as string);
      }
    });
  }

  public static unsetStyle(element: HTMLElement, style: NoDimensionCSSStyle) {
    const unsetStyles = Object.keys(style).reduce<GenericObject>((obj, styleName) => {
      obj[styleName] = '';
      return obj;
    }, {});
    Object.assign(element.style, unsetStyles);
  }

  public static unsetAllCSSStates(buttonElement: HTMLElement, statefulStyle: StatefulCSS) {
    if (statefulStyle.click) ElementStyle.unsetStyle(buttonElement, statefulStyle.click);
    if (statefulStyle.hover) ElementStyle.unsetStyle(buttonElement, statefulStyle.hover);
    if (statefulStyle.default) ElementStyle.unsetStyle(buttonElement, statefulStyle.default);
  }
}
