import {DateCellInputElement} from '../cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {UserKeyEventsStateUtil} from '../../utils/userEventsState/userEventsStateUtil';
import {CellWithTextEvents} from '../cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {OverlayElements} from '../../types/overlayElements';
import {MOUSE_EVENT} from '../../consts/mouseEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // not using hoveredElements state as the targetElement will be the element clicked, hence need to use
  // overlayElementsState.datePickerCell to get the cell of the date picker input
  // prettier-ignore
  private static closeDatePicker(overlayElementsState: OverlayElements, targetElement: HTMLElement) {
    if (overlayElementsState.datePickerCell) {
      if (overlayElementsState.datePickerCell !== CellElement.extractCellElement(targetElement)) {
        DateCellInputElement.toggle(overlayElementsState.datePickerCell, false);
      }
      delete overlayElementsState.datePickerCell;
    }
  }
  // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
  // or delete cateogory buttons are clicked, hence once that happens and the user clicks elsewhere on the table,
  // the dropdown is closed programmatically as follows
  // prettier-ignore
  private static closeCategoryDropdown(etc: EditableTableComponent, targetElement: HTMLElement) {
    const {focusedElements} = etc;
    if (focusedElements.categoryDropdown && !Dropdown.isPartOfDropdownElement(targetElement)
        && focusedElements.cell.element !== CellElement.extractCellElement(targetElement)) {
      CellWithTextEvents.programmaticBlur(etc);
    }
  }

  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    UserKeyEventsStateUtil.temporarilyIndicateEvent(this.userKeyEventsState, MOUSE_EVENT.DOWN);
    TableEvents.closeCategoryDropdown(this, targetElement);
    TableEvents.closeDatePicker(this.overlayElementsState, event.target as HTMLElement);
  }

  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    if (this.tableElementEventState.selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseUp(this, event.target as HTMLElement);
    }
  }
}
