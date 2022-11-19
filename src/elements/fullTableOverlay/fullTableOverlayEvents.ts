import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const {overlayElementsState: {columnDropdown, rowDropdown}} = this;
    // window events will instead handle user clicks outside of the shadow dom
    if (Dropdown.isDisplayed(columnDropdown) && !Dropdown.isPartOfDropdownElement(event.target as HTMLElement)) {
      ColumnDropdown.processTextAndHide(this);
    }
    if (Dropdown.isDisplayed(rowDropdown)) {
      RowDropdown.hide(this);
    }
  }
}
