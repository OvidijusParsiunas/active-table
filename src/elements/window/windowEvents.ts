import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {CategoryCellEvents} from '../cell/categoryCellEvents';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    // window event.target can only identify the parent element in shadow dom, not elements
    // inside it, hence if the user clicks inside the element, the elements inside will
    // handle the click event instead (full table overlay element for column dropdown)
    if ((event.target as HTMLElement).tagName === EditableTableComponent.ELEMENT_TAG) return;
    const {overlayElementsState: { columnDropdown }, focusedElements } = this
    // if the user clicks outside of the shadow dom and a dropdown is open, close it
    if (Dropdown.isDisplayed(columnDropdown)) {
      ColumnDropdown.processTextAndHide(this);
    // cell blur will not activate when the dropdown has been clicked and will not close if its scrollbar or padding are
    // clicked, hence once that happens, we close the dropdown programmatically as follows
    } else if (focusedElements.categoryDropdown) {
      CategoryCellEvents.programmaticBlur(this);
    }
  }
}
