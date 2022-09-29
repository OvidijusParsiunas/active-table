import {SIDE} from '../../types/side';

interface VisibilityDetails {
  isFullyVisible: boolean;
  blockingSide?: SIDE;
}

export class ElementVisibility {
  public static getDetailsInWindow(element: HTMLElement): VisibilityDetails {
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

  public static isVisibleInsideParent(element: HTMLElement) {
    const parentContainer = element.parentElement as HTMLElement;
    const cTop = parentContainer.scrollTop;
    const cBottom = cTop + parentContainer.clientHeight;

    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;

    const isTotal = eTop >= cTop && eBottom <= cBottom;
    const isPartial = (eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom);

    return isPartial ? false : isTotal;
  }
}
