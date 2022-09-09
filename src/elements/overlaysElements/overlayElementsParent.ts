import {EditableTableComponent} from '../../editable-table-component';

export class OverlayElementsParent {
  public static create(etc: EditableTableComponent) {
    const overlayElementsParent = document.createElement('div');
    (etc.tableElementRef as HTMLElement).appendChild(overlayElementsParent);
    etc.overlayElementsParentRef = overlayElementsParent;
    return overlayElementsParent;
  }
}
