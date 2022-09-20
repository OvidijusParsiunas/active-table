import {EditableTableComponent} from '../../editable-table-component';
import {FullTableOverlayEvents} from './fullTableOverlayEvents';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';

export class FullTableOverlayElement {
  public static create(etc: EditableTableComponent) {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'full-table-overlay';
    overlayElement.style.backgroundColor = SEMI_TRANSPARENT_COLOR;
    overlayElement.style.display = 'none';
    overlayElement.onmousedown = FullTableOverlayEvents.onMouseDown.bind(etc);
    return overlayElement;
  }
}
