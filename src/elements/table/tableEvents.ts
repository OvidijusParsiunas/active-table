import {DateCellInputElement} from '../cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {UserKeyEventsStateUtils} from '../../utils/userEventsState/userEventsStateUtils';
import {ColumnSizerExtrinsicEvents} from '../columnSizer/columnSizerExtrinsicEvents';
import {CellWithTextEvents} from '../cell/cellsWithTextDiv/cellWithTextEvents';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {EditableTableComponent} from '../../editable-table-component';
import {MOUSE_EVENT} from '../../consts/mouseEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // not using hoveredElements state as the targetElement will be the element clicked, hence need to use
  // activeOverlayElements.datePickerCell to get the cell of the date picker input
  // prettier-ignore
  private static closeDatePicker(activeOverlayElements: ActiveOverlayElements, targetElement: HTMLElement) {
    if (activeOverlayElements.datePickerCell) {
      if (activeOverlayElements.datePickerCell !== CellElement.getCellElement(targetElement)) {
        DateCellInputElement.toggle(activeOverlayElements.datePickerCell, false);
      }
      delete activeOverlayElements.datePickerCell;
    }
  }
  // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
  // or delete cateogory buttons are clicked, hence once that happens and the user clicks elsewhere on the table,
  // the dropdown is closed programmatically as follows
  // prettier-ignore
  private static closeCategoryDropdown(etc: EditableTableComponent, targetElement: HTMLElement) {
    const {focusedElements} = etc;
    if (focusedElements.categoryDropdown && !Dropdown.isPartOfDropdownElement(targetElement)
        && focusedElements.cell.element !== CellElement.getCellElement(targetElement)) {
      CellWithTextEvents.programmaticBlur(etc);
    }
  }

  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    UserKeyEventsStateUtils.temporarilyIndicateEvent(this.userKeyEventsState, MOUSE_EVENT.DOWN);
    TableEvents.closeCategoryDropdown(this, targetElement);
    TableEvents.closeDatePicker(this.activeOverlayElements, event.target as HTMLElement);
  }

  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    if (this.activeOverlayElements.selectedColumnSizer) {
      ColumnSizerExtrinsicEvents.tableMouseUp(this, event.target as HTMLElement);
    }
  }
}
