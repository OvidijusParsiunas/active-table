import {DateCellInputElement} from '../cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {UserKeyEventsStateUtils} from '../../utils/userEventsState/userEventsStateUtils';
import {OptionColorButton} from '../dropdown/cellDropdown/buttons/optionColorButton';
import {ColumnSizerExtrinsicEvents} from '../columnSizer/columnSizerExtrinsicEvents';
import {CellWithTextEvents} from '../cell/cellsWithTextDiv/cellWithTextEvents';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {MOUSE_EVENT} from '../../consts/mouseEvents';
import {CellElement} from '../cell/cellElement';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // not using hoveredElements state as the targetElement will be the element clicked, hence need to use
  // activeOverlayElements.datePickerCell to get the cell of the date picker input
  private static closeDatePicker(activeOverlayElements: ActiveOverlayElements, targetElement: HTMLElement) {
    if (activeOverlayElements.datePickerCell) {
      if (activeOverlayElements.datePickerCell !== CellElement.getCellElement(targetElement)) {
        DateCellInputElement.toggle(activeOverlayElements.datePickerCell, false);
      }
      delete activeOverlayElements.datePickerCell;
    }
  }

  // REF-44
  // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
  // or delete category buttons are clicked. If the user clicks elsewhere on the table, the dropdown is closed
  // programmatically as follows
  // prettier-ignore
  private static closeCellDropdown(at: ActiveTable, targetElement: HTMLElement) {
    const {_focusedElements} = at;
    if (_focusedElements.cellDropdown && !Dropdown.isPartOfDropdownElement(targetElement)
        && !targetElement.classList.contains(OptionColorButton.COLOR_BUTTON_CLASS)
        && _focusedElements.cell.element !== CellElement.getCellElement(targetElement)) {
      CellWithTextEvents.programmaticBlur(at);
    }
  }

  public static onMouseDown(this: ActiveTable, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    UserKeyEventsStateUtils.temporarilyIndicateEvent(this._userKeyEventsState, MOUSE_EVENT.DOWN);
    TableEvents.closeCellDropdown(this, targetElement);
    TableEvents.closeDatePicker(this._activeOverlayElements, event.target as HTMLElement);
  }

  public static onMouseUp(this: ActiveTable, event: MouseEvent) {
    if (this._activeOverlayElements.selectedColumnSizer) {
      ColumnSizerExtrinsicEvents.tableMouseUp(this, event.target as HTMLElement);
    }
  }
}
