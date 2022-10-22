import {UserKeyEventsStateUtil} from '../../utils/userEventsState/userEventsStateUtil';
import {CellsWithTextEvents} from '../cell/cellsWithTextDiv/cellsWithTextEvents';
import {DateCellElement} from '../cell/cellsWithTextDiv/dateCellElement';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElement} from '../columnSizer/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {OverlayElements} from '../../types/overlayElements';
import {MOUSE_EVENT} from '../../consts/mouseEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // not using hoveredElements state as the targetElement will be the element clicked, hence need to use
  // overlayElementsState.datePickerInput to get the cell of the date picker input
  // prettier-ignore
  private static closeDatePicker(overlayElementsState: OverlayElements, targetElement: HTMLElement) {
    if (overlayElementsState.datePickerInput) {
      if (DateCellElement.getCellElement(overlayElementsState.datePickerInput)
          !== DateCellElement.getCellElement(targetElement)) {
        DateCellElement.hideDatePicker(overlayElementsState.datePickerInput);
      }
      delete overlayElementsState.datePickerInput;
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
      CellsWithTextEvents.programmaticBlur(etc);
    }
  }

  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    UserKeyEventsStateUtil.temporarilyIndicateEvent(this.userKeyEventsState, MOUSE_EVENT.DOWN);
    if (targetElement.classList.contains(ColumnSizerElement.COLUMN_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = targetElement;
      ColumnSizerEvents.tableOnMouseDown(targetElement, this.columnResizerStyle.click?.backgroundColor);
    }
    TableEvents.closeCategoryDropdown(this, targetElement);
    TableEvents.closeDatePicker(this.overlayElementsState, event.target as HTMLElement);
  }

  // prettier-ignore
  public static onMouseUp(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails, columnResizerStyle } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseUp(
        selectedColumnSizer, columnsDetails, event.target as HTMLElement, columnResizerStyle.hover?.backgroundColor);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }

  // prettier-ignore
  public static onMouseMove(this: EditableTableComponent, event: MouseEvent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseMove(selectedColumnSizer, columnsDetails, event.movementX);
    }
  }

  // prettier-ignore
  public static onMouseLeave(this: EditableTableComponent) {
    const { tableElementEventState: { selectedColumnSizer }, columnsDetails } = this;
    if (selectedColumnSizer) {
      ColumnSizerEvents.tableOnMouseLeave(selectedColumnSizer, columnsDetails);
      delete this.tableElementEventState.selectedColumnSizer;
    }
  }
}
