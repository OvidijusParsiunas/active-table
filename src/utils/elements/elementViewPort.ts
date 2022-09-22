import {SIDE} from '../../types/side';

interface BlockingSide {
  isFullyVisible: boolean;
  blockingSide?: SIDE;
}

export class ElementViewPort {
  public static getVisibilityDetails(element: HTMLElement): BlockingSide {
    let top = element.offsetTop;
    let left = element.offsetLeft;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    while (element.offsetParent) {
      element = element.offsetParent as HTMLElement;
      top += element.offsetTop;
      left += element.offsetLeft;
    }

    if (top < window.pageYOffset) {
      return {isFullyVisible: false, blockingSide: SIDE.TOP};
    }
    if (top + height > window.pageYOffset + window.innerHeight) {
      return {isFullyVisible: false, blockingSide: SIDE.BOTTOM};
    }
    if (left < window.pageXOffset) {
      return {isFullyVisible: false, blockingSide: SIDE.LEFT};
    }
    if (left + width > window.pageXOffset + window.innerWidth) {
      return {isFullyVisible: false, blockingSide: SIDE.RIGHT};
    }
    return {isFullyVisible: true};
  }
}
