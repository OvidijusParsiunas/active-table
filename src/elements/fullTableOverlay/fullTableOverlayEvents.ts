import {EditableTableComponent} from '../../editable-table-component';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const {columnDropdown, fullTableOverlay} = this.overlayElementsState;
    // window events will handle if the dropdown is open and the user clicks outside of the shadow dom
    if (Dropdown.isDisplayed(columnDropdown) && !Dropdown.isPartOfDropdownElement(event.target as HTMLElement)) {
      Dropdown.hideRelevantDropdownElements(
        this.highlightedHeaderCell.element as HTMLElement, columnDropdown as HTMLElement, fullTableOverlay as HTMLElement);
    }
  }
}
