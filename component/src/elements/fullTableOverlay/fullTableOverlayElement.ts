import {FullTableOverlayEvents} from './fullTableOverlayEvents';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {Browser} from '../../utils/browser/browser';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayElement {
  // at offsets is a bug fix for a situation where the user was able to click the table border, focus and unfocus a cell
  // and therefore not allow the column dropdown to close because there is nothing focused
  public static display(at: ActiveTable) {
    const fullTableOverlay = at._activeOverlayElements.fullTableOverlay as HTMLElement;
    fullTableOverlay.style.width = `${at.offsetWidth}px`;
    fullTableOverlay.style.height = `${at.offsetHeight}px`;
    if (at._overflow?.overflowContainer) {
      fullTableOverlay.style.top = `${at.offsetTop}px`;
      fullTableOverlay.style.left = `${at.offsetLeft}px`;
    } else {
      // if available in the future, can use a top outer container reference
      const topOuterContainerHeight = (at._tableElementRef as HTMLElement).offsetTop - at.offsetTop;
      fullTableOverlay.style.top = `-${
        Browser.IS_FIREFOX ? topOuterContainerHeight : topOuterContainerHeight + at._tableDimensions.border.topWidth
      }px`;
      fullTableOverlay.style.left = `-${Browser.IS_FIREFOX ? 0 : at._tableDimensions.border.leftWidth}px`;
    }
    Dropdown.display(fullTableOverlay);
  }

  public static create(at: ActiveTable) {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'full-table-overlay';
    overlayElement.style.backgroundColor = SEMI_TRANSPARENT_COLOR;
    overlayElement.style.display = 'none';
    overlayElement.onmousedown = FullTableOverlayEvents.onMouseDown.bind(at);
    return overlayElement;
  }
}
