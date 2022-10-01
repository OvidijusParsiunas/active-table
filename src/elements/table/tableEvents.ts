import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElement} from '../columnSizer/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const element = event.target as HTMLElement;
    if (element.classList.contains(ColumnSizerElement.COLUMN_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = element;
      ColumnSizerEvents.tableOnMouseDown(
        this.tableElementEventState.selectedColumnSizer, this.columnResizerStyle.click?.backgroundColor);
    }
    const categoryDropdown = this.overlayElementsState.categoryDropdown as HTMLElement;
    // can be repurposed for other dropdowns (column dropdown does not need it as mouse hits the overlay first)
    if (Dropdown.isDisplayed(categoryDropdown)
        && !Dropdown.isPartOfDropdownElement(element) && element !== this.focusedCell.element) {
      const { focusedCell: { rowIndex, columnIndex, element }, columnsDetails } = this;
      const columnDetails = columnsDetails[columnIndex as number];
      CategoryDropdown.hideAndSetText(this, columnDetails,
        rowIndex as number, columnIndex as number, element as HTMLElement, categoryDropdown);
    }
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
