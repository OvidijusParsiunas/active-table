import {EditableTableComponent} from '../../editable-table-component';
import {HeaderCellEvents} from '../cell/headerCellEvents';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const {columnDropdown, fullTableOverlay} = this.overlayElementsState;
    if (Dropdown.isDisplayed(columnDropdown) && !Dropdown.isDropdownElement(event.target as HTMLElement)) {
      HeaderCellEvents.fadeCell(this.highlightedHeaderCell.element as HTMLElement);
      Dropdown.hideElements(columnDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    }
  }
}
