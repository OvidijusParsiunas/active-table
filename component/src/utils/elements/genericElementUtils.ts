import {GenericObject} from '../../types/genericObject';

export class GenericElementUtils {
  public static readonly NOT_SELECTABLE_CLASS = 'not-selectable';

  public static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  public static getStyleWidth(element: HTMLElement, cssProperty: keyof CSSStyleDeclaration) {
    return Number.parseFloat(element.style[cssProperty] as string) || 0;
  }

  public static doesElementExistInDom(element: HTMLElement) {
    return !!element.parentElement;
  }

  public static isParentWidthUndetermined(width: string) {
    return width === '' || width === 'fit-content' || width === 'min-content' || width === 'max-content';
  }

  public static isFirstChildInParent(element: HTMLElement) {
    return element.parentElement?.firstChild === element;
  }

  public static setStyle(element: HTMLElement, style: string, value: string) {
    (element.style as unknown as GenericObject)[style] = value;
  }

  // prettier-ignore
  public static moveStyles(sourceElement: HTMLElement, destinationElement: HTMLElement,
      ...styles: (keyof CSSStyleDeclaration)[]) {
    styles.forEach((style) => {
      if (sourceElement.style[style]) {
        GenericElementUtils.setStyle(destinationElement, style as string, sourceElement.style[style] as string);
      }
    });
  }
}
