import {EditableTableComponent} from '../../editable-table-component';
import {FullTableOverlayEvents} from './fullTableOverlayEvents';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {Browser} from '../../utils/browser/browser';
import {TableElement} from '../table/tableElement';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayElement {
  // this is a bug fix for a situation where the user was able to click the table border, focus and unfocus a cell
  // and therefore not allow the column dropdown to close because there is nothing focused
  public static display(etc: EditableTableComponent) {
    const fullTableOverlay = etc.activeOverlayElements.fullTableOverlay as HTMLElement;
    fullTableOverlay.style.width = `${etc.offsetWidth}px`;
    fullTableOverlay.style.height = `${etc.offsetHeight}px`;
    fullTableOverlay.style.top = `-${Browser.IS_FIREFOX ? 0 : TableElement.BORDER_DIMENSIONS.topWidth}px`;
    fullTableOverlay.style.left = `-${Browser.IS_FIREFOX ? 0 : TableElement.BORDER_DIMENSIONS.leftWidth}px`;
    Dropdown.display(fullTableOverlay);
  }

  public static create(etc: EditableTableComponent) {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'full-table-overlay';
    overlayElement.style.backgroundColor = SEMI_TRANSPARENT_COLOR;
    overlayElement.style.display = 'none';
    overlayElement.onmousedown = FullTableOverlayEvents.onMouseDown.bind(etc);
    return overlayElement;
  }
}
