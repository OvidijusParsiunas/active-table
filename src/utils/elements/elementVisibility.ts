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

  public static isVerticallyVisibleInsideParent(element: HTMLElement): VisibilityDetails {
    const parentContainer = element.parentElement as HTMLElement;
    const containerScrollTop = parentContainer.scrollTop;
    const containerScrollBottom = containerScrollTop + parentContainer.clientHeight;

    const elOffsetTop = element.offsetTop;
    const elOffsetBottom = elOffsetTop + element.clientHeight;

    // partial top
    if (elOffsetTop < containerScrollTop && elOffsetBottom > containerScrollTop) {
      return {isFullyVisible: false, blockingSide: SIDE.TOP};
    }
    // partial bottom
    if (elOffsetBottom > containerScrollBottom && elOffsetTop < containerScrollBottom) {
      return {isFullyVisible: false, blockingSide: SIDE.BOTTOM};
    }
    // fully hidden top
    if (elOffsetTop < containerScrollTop) {
      return {isFullyVisible: false, blockingSide: SIDE.TOP};
    }
    // fully hidden bottom
    if (elOffsetBottom > containerScrollBottom) {
      return {isFullyVisible: false, blockingSide: SIDE.BOTTOM};
    }
    return {isFullyVisible: true};
  }
}
