export class ElementViewPort {
  public static isIn(element: HTMLElement) {
    let top = element.offsetTop;
    let left = element.offsetLeft;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    while (element.offsetParent) {
      element = element.offsetParent as HTMLElement;
      top += element.offsetTop;
      left += element.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      top + height <= window.pageYOffset + window.innerHeight &&
      left + width <= window.pageXOffset + window.innerWidth
    );
  }
}
