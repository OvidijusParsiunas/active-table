export class GenericElementUtils {
  public static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  public static getStyleWidth(element: HTMLElement, cssProperty: keyof CSSStyleDeclaration) {
    return Number.parseFloat(element.style[cssProperty] as string) || 0;
  }

  public static doesElementExistInDom(element: HTMLElement) {
    return !!element.parentElement;
  }
}
