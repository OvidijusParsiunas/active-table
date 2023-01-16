import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class FullTableOverlayEvents {
  // prettier-ignore
  public static onMouseDown(this: ActiveTable, event: MouseEvent) {
    const {activeOverlayElements: {columnDropdown, rowDropdown}} = this;
    // window events will instead handle user clicks outside of the shadow dom
    if (Dropdown.isDisplayed(columnDropdown) && !Dropdown.isPartOfDropdownElement(event.target as HTMLElement)) {
      ColumnDropdown.processTextAndHide(this);
    }
    if (Dropdown.isDisplayed(rowDropdown)) {
      RowDropdown.hide(this);
    }
  }
}
