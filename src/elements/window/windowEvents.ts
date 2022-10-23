import {CategoryCellEvents} from '../cell/cellsWithTextDiv/categoryCell/categoryCellEvents';
import {DateCellElement} from '../cell/cellsWithTextDiv/dateCell/dateCellElement';
import {CellsWithTextEvents} from '../cell/cellsWithTextDiv/cellsWithTextEvents';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {USER_SET_COLUMN_TYPE} from '../../enums/columnType';
import {CellDetails} from '../../types/focusedCell';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  public static onKeyDown(this: EditableTableComponent, event: KeyboardEvent) {
    const {columnIndex, rowIndex} = this.focusedElements.cell as CellDetails;
    if (this.columnsDetails[columnIndex]?.userSetColumnType === USER_SET_COLUMN_TYPE.Category) {
      CategoryCellEvents.keyDownText(this, columnIndex, rowIndex, event);
    }
  }

  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    // window event.target can only identify the parent element in shadow dom, not elements
    // inside it, hence if the user clicks inside the element, the elements inside will
    // handle the click event instead (full table overlay element for column dropdown)
    // and table element for the other closable elements  
    if ((event.target as HTMLElement).tagName === EditableTableComponent.ELEMENT_TAG) return;
    const {overlayElementsState: { columnDropdown }, focusedElements } = this
    // if the user clicks outside of the shadow dom and a dropdown is open, close it
    if (Dropdown.isDisplayed(columnDropdown)) {
      ColumnDropdown.processTextAndHide(this);
    // cell blur will not activate when the dropdown has been clicked and will not close if its scrollbar or padding are
    // clicked, hence once that happens, we close the dropdown programmatically as follows
    } else if (focusedElements.categoryDropdown) {
      CellsWithTextEvents.programmaticBlur(this);
    } else if (this.overlayElementsState.datePickerInput) {
      DateCellElement.hideDatePicker(this.overlayElementsState.datePickerInput);
      delete this.overlayElementsState.datePickerInput;
    }
  }
}
