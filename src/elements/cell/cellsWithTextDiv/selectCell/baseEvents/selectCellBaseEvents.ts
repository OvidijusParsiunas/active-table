import {EditableTableComponent} from '../../../../../editable-table-component';
import {CellWithTextEvents} from '../../cellWithTextEvents';

// used for both - select and label cell text events
export class SelectCellBaseEvents {
  public static blurIfDropdownFocused(etc: EditableTableComponent) {
    // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
    // or delete select buttons are clicked, hence once that happens and the user clicks on another select cell,
    // the dropdown is closed programmatically as follows
    if (etc.focusedElements.selectDropdown) {
      CellWithTextEvents.programmaticBlur(etc);
    }
  }
}
