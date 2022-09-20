import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';

export class FullTableOverlayElement {
  public static create() {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'full-table-overlay';
    overlayElement.style.backgroundColor = SEMI_TRANSPARENT_COLOR;
    overlayElement.style.display = 'none';
    return overlayElement;
  }
}
