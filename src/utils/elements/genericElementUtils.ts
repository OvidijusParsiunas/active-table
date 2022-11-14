export class GenericElementUtils {
  public static hideElements(...elements: HTMLElement[]) {
    elements.forEach((element: HTMLElement) => (element.style.display = 'none'));
  }

  public static getElementTotalHorizontalSideBorderWidth(element: HTMLElement) {
    if (element.style.borderWidth) {
      return Number.parseFloat(element.style.borderWidth) * 2;
    }
    const leftBorderWidth = Number.parseFloat(element.style.borderLeftWidth) || 0;
    const rightBorderWidth = Number.parseFloat(element.style.borderRightWidth) || 0;
    return leftBorderWidth + rightBorderWidth;
  }

  public static doesElementExistInDom(element: HTMLElement) {
    return !!element.parentElement;
  }
}
