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
}
