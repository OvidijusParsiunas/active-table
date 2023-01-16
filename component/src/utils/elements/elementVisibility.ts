import {TableElement} from '../../elements/table/tableElement';
import {SIDE} from '../../types/side';

interface FullyVisible {
  isFullyVisible: true;
}

interface PartiallyVisible {
  isFullyVisible: false;
  blockingSides: Set<SIDE>;
}

type VisibilityDetails = FullyVisible | PartiallyVisible;

export class ElementVisibility {
  // prettier-ignore
  public static getDetailsInWindow(element: HTMLElement, isInsideTable = true): VisibilityDetails {
    const {topWidth: topBorderWidth, leftWidth: leftBorderWidth} = isInsideTable
      ? TableElement.BORDER_DIMENSIONS : {topWidth: 0, leftWidth: 0};
    let top = element.offsetTop;
    let left = element.offsetLeft;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    while (element.offsetParent) {
      element = element.offsetParent as HTMLElement;
      top += element.offsetTop;
      left += element.offsetLeft;
    }
    const blockingSides: Set<SIDE> = new Set();
    if (top < window.pageYOffset) {
      blockingSides.add(SIDE.TOP);
    }
    if (top + height + topBorderWidth > window.pageYOffset + window.innerHeight) {
      blockingSides.add(SIDE.BOTTOM);
    }
    if (left < window.pageXOffset) {
      blockingSides.add(SIDE.LEFT);
    }
    if (left + width + leftBorderWidth > window.pageXOffset + window.innerWidth) {
      blockingSides.add(SIDE.RIGHT);
    }
    if (blockingSides.size > 0) return {isFullyVisible: false, blockingSides};
    return {isFullyVisible: true};
  }

  // no real need to take care of multiple blockages for now
  public static isVerticallyVisibleInsideParent(element: HTMLElement, shadowRoot?: Document): VisibilityDetails {
    // it has been identified that when a column setting is reset where the previous and new active types are select
    // and select dropdown is then opened up that element.parentElement returns null
    const parentContainer = (element.parentElement as HTMLElement) || shadowRoot;
    const containerScrollTop = parentContainer.scrollTop;
    const containerScrollBottom = containerScrollTop + parentContainer.clientHeight;

    const elOffsetTop = element.offsetTop;
    const elOffsetBottom = elOffsetTop + element.clientHeight;

    if (elOffsetTop < containerScrollTop) {
      return {isFullyVisible: false, blockingSides: new Set([SIDE.TOP])};
    }
    if (elOffsetBottom > containerScrollBottom) {
      return {isFullyVisible: false, blockingSides: new Set([SIDE.BOTTOM])};
    }
    return {isFullyVisible: true};
  }
}

// The following example contains a way to identify if an element is partailly visible:

// public static isVerticallyVisibleInsideParent(element: HTMLElement): VisibilityDetails {
//   const parentContainer = element.parentElement as HTMLElement;
//   const containerScrollTop = parentContainer.scrollTop;
//   const containerScrollBottom = containerScrollTop + parentContainer.clientHeight;

//   const elOffsetTop = element.offsetTop;
//   const elOffsetBottom = elOffsetTop + element.clientHeight;

//   // partial top
//   if (elOffsetTop < containerScrollTop && elOffsetBottom > containerScrollTop) {
//     return {isFullyVisible: false, blockingSides: new Set([SIDE.TOP])};
//   }
//   // partial bottom
//   if (elOffsetBottom > containerScrollBottom && elOffsetTop < containerScrollBottom) {
//     return {isFullyVisible: false, blockingSides: new Set([SIDE.BOTTOM])};
//   }
//   // fully hidden top
//   if (elOffsetTop < containerScrollTop) {
//     return {isFullyVisible: false, blockingSides: new Set([SIDE.TOP])};
//   }
//   // fully hidden bottom
//   if (elOffsetBottom > containerScrollBottom) {
//     return {isFullyVisible: false, blockingSides: new Set([SIDE.BOTTOM])};
//   }
//   return {isFullyVisible: true};
// }
