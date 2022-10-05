import {CategoryDropdown} from '../dropdown/categoryDropdown/categoryDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElement} from '../columnSizer/columnSizerElement';
import {ColumnSizerEvents} from '../columnSizer/columnSizerEvents';
import {CellElement} from '../cell/cellElement';
import {Dropdown} from '../dropdown/dropdown';

export class TableEvents {
  // prettier-ignore
  private static closeCategoryDropdown(etc: EditableTableComponent, targetElement: HTMLElement) {
    const { focusedCategoryDropdown, focusedCell, overlayElementsState: { categoryDropdown } } = etc;
    if (focusedCategoryDropdown.element && !Dropdown.isPartOfDropdownElement(targetElement)) {
      if (focusedCell.element !== CellElement.extractCellElement(targetElement)) {
        CategoryDropdown.hide(categoryDropdown as HTMLElement);
      }
      // remove the reference as the dropdown is no longer focused
      delete focusedCategoryDropdown.element;
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
