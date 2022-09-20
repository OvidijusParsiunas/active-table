import {EditableTableComponent} from '../../editable-table-component';
import {HeaderCellEvents} from '../cell/headerCellEvents';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayEvents {
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const {columnDropdown, fullTableOverlay} = this.overlayElementsState;
    // window events will handle if the dropdown is open and the user clicks outside of the shadow dom
    if (Dropdown.isDisplayed(columnDropdown) && !Dropdown.isPartOfDropdownElement(event.target as HTMLElement)) {
      HeaderCellEvents.fadeCell(this.highlightedHeaderCell.element as HTMLElement);
      Dropdown.hideElements(columnDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    }
  }
}
