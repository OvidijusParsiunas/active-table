import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElement} from '../columnSizer/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {CategoryCellEvents} from '../cell/categoryCellEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // cell blur will not activate when the dropdown has been clicked and will not close if its scrollbar or padding are
  // clicked, hence once that happens, we close the dropdown programmatically as follows
  // prettier-ignore
  private static closeCategoryDropdown(etc: EditableTableComponent, targetElement: HTMLElement) {
    const { focusedElements } = etc;
    if (focusedElements.categoryDropdown && !Dropdown.isPartOfDropdownElement(targetElement)) {
      if (focusedElements.cell.element !== CellElement.extractCellElement(targetElement)) {
        CategoryCellEvents.programmaticBlur(etc);
      }
    }
  }

  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains(ColumnSizerElement.COLUMN_SIZER_CLASS)) {
      this.tableElementEventState.selectedColumnSizer = targetElement;
      ColumnSizerEvents.tableOnMouseDown(
        this.tableElementEventState.selectedColumnSizer, this.columnResizerStyle.click?.backgroundColor);
    }
    TableEvents.closeCategoryDropdown(this, targetElement);
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
