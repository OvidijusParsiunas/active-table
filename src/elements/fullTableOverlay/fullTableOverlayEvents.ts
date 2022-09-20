import {EditableTableComponent} from '../../editable-table-component';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    // window events will handle if the dropdown is open and the user clicks outside of the shadow dom
    if (Dropdown.isDisplayed(this.overlayElementsState.columnDropdown)
        && !Dropdown.isPartOfDropdownElement(event.target as HTMLElement)) {
      Dropdown.hideRelevantDropdownElements(this);
    }
  }
}
