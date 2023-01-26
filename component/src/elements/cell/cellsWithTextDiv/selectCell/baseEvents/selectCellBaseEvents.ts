import {CellWithTextEvents} from '../../cellWithTextEvents';
import {ActiveTable} from '../../../../../activeTable';

// used for both - select and label cell text events
export class SelectCellBaseEvents {
  public static blurIfDropdownFocused(at: ActiveTable) {
    // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
    // or option del/col buttons are clicked, hence once that happens and the user clicks on another select/label
    // cell, the dropdown is closed programmatically as follows
    if (at.focusedElements.cellDropdown) {
      CellWithTextEvents.programmaticBlur(at);
    }
  }
}
