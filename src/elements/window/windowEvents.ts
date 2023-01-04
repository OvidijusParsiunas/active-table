import {NumberOfRowsDropdownEvents} from '../pagination/numberOfRowsOptions/optionsButton/numberOfRowsDropdownEvents';
import {CategoryCellEvents} from '../cell/cellsWithTextDiv/categoryCell/categoryCellEvents';
import {DateCellInputElement} from '../cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {DateCellInputEvents} from '../cell/cellsWithTextDiv/dateCell/dateCellInputEvents';
import {ColumnSizerExtrinsicEvents} from '../columnSizer/columnSizerExtrinsicEvents';
import {ColumnDropdownEvents} from '../dropdown/columnDropdown/columnDropdownEvents';
import {ColumnSettingsUtils} from '../../utils/columnSettings/columnSettingsUtils';
import {CellWithTextEvents} from '../cell/cellsWithTextDiv/cellWithTextEvents';
import {RowDropdownEvents} from '../dropdown/rowDropdown/rowDropdownEvents';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {EditableTableComponent} from '../../editable-table-component';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  // prettier-ignore
  public static onKeyDown(this: EditableTableComponent, event: KeyboardEvent) {
    if (Dropdown.isDisplayed(this.paginationInternal.numberOfRowsDropdown)) {
      NumberOfRowsDropdownEvents.windowOnKeyDown.bind(this)(this, event);
    }
    if (Dropdown.isDisplayed(this.activeOverlayElements.rowDropdown)) {
      RowDropdownEvents.windowOnKeyDown(this, event);
    }
    const {rowIndex, columnIndex, element} = this.focusedElements.cell;
    if (rowIndex === undefined || columnIndex === undefined) return;
    if (rowIndex === 0 && !Dropdown.isDisplayed(this.activeOverlayElements.columnDropdown)) {
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      ColumnSettingsUtils.changeColumnSettingsIfNameDifferent(this, element as HTMLElement, columnIndex);
      return;
    }
    // workaround for when opened dropdown does not have a focused item
    } else if (Dropdown.isDisplayed(this.activeOverlayElements.columnDropdown) && !this.shadowRoot?.activeElement) {
      ColumnDropdownEvents.onKeyDown.bind(this)(this.activeOverlayElements.columnDropdown as HTMLElement, event);
      return;
    }
    if (this.columnsDetails[columnIndex].activeType.categories
        && Dropdown.isDisplayed(this.columnsDetails[columnIndex].categoryDropdown.element)) {
      CategoryCellEvents.keyDownText(this, rowIndex, columnIndex, event);
    }
  }

  public static onKeyUp(this: EditableTableComponent, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      DateCellInputEvents.escapeKeyInput(this);
    }
  }

  // prettier-ignore
  public static onMouseDown(this: EditableTableComponent, event: MouseEvent) {
    if (Dropdown.isDisplayed(this.paginationInternal.numberOfRowsDropdown)) {
      NumberOfRowsDropdownEvents.windowOnMouseDown.bind(this)(this);
    }
    // window event.target can only identify the parent element in shadow dom, not elements
    // inside it, hence if the user clicks inside the element, the elements inside will
    // handle the click event instead (full table overlay element for column dropdown)
    // and table element for the other closable elements  
    if ((event.target as HTMLElement).tagName === EditableTableComponent.ELEMENT_TAG) return;
    const {activeOverlayElements: {columnDropdown, rowDropdown}, focusedElements} = this
    // if the user clicks outside of the shadow dom and a dropdown is open, close it
    if (Dropdown.isDisplayed(rowDropdown)) {
      RowDropdown.hide(this);
    }
    if (Dropdown.isDisplayed(columnDropdown)) {
      ColumnDropdown.processTextAndHide(this);
    // cell blur will not activate when the dropdown has been clicked and will not close if its scrollbar or padding are
    // clicked, hence once that happens, we close the dropdown programmatically as follows
    } else if (focusedElements.categoryDropdown) {
      CellWithTextEvents.programmaticBlur(this);
    } else if (this.activeOverlayElements.datePickerCell) {
      DateCellInputElement.toggle(this.activeOverlayElements.datePickerCell, false);
      delete this.activeOverlayElements.datePickerCell;
    }
  }

  public static onMouseUp(this: EditableTableComponent) {
    if (this.activeOverlayElements.selectedColumnSizer) ColumnSizerExtrinsicEvents.windowMouseUp(this);
  }

  public static onMouseMove(this: EditableTableComponent, event: MouseEvent) {
    if (this.activeOverlayElements.selectedColumnSizer) ColumnSizerExtrinsicEvents.windowMouseMove(this, event.movementX);
  }
}
