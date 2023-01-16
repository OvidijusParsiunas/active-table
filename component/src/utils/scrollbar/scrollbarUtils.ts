export class ScrollbarUtils {
  public static isVerticalPresent(element: HTMLElement) {
    return element.scrollHeight > element.clientHeight;
  }

  public static isHorizontalPresent(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }
}
