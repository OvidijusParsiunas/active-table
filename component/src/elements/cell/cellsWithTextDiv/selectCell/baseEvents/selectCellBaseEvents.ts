import {CellWithTextEvents} from '../../cellWithTextEvents';
import {ActiveTable} from '../../../../../activeTable';

// used for both - select and label cell text events
export class SelectCellBaseEvents {
  public static blurIfDropdownFocused(at: ActiveTable) {
    // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
    // or delete select buttons are clicked, hence once that happens and the user clicks on another select cell,
    // the dropdown is closed programmatically as follows
    if (at.focusedElements.selectDropdown) {
      CellWithTextEvents.programmaticBlur(at);
    }
  }
}
