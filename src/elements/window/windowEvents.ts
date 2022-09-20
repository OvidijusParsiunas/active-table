import {EditableTableComponent} from '../../editable-table-component';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    // window event.target can only identify the parent element in shadow dom, not elements
    // inside it, hence if the user clicks inside the element, the elements inside will
    // handle the click event instead (full table overlay element for column dropdown)
    if ((event.target as HTMLElement).tagName === EditableTableComponent.ELEMENT_TAG) return;
    // if the user clicks outside of the shadow dom and the column dropdown is open,
    // close the column dropdown
    if (Dropdown.isDisplayed(this.overlayElementsState.columnDropdown)) {
      Dropdown.hideRelevantDropdownElements(this);
    }
  }
}
