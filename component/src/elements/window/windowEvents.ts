import {SelectCellTextBaseEvents} from '../cell/cellsWithTextDiv/selectCell/baseEvents/selectCellTextBaseEvents';
import {OuterDropdownEvents} from '../../utils/outerTableComponents/dropdown/outerDropdownEvents';
import {OptionColorButtonEvents} from '../dropdown/cellDropdown/buttons/optionColorButtonEvents';
import {DateCellInputElement} from '../cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {DateCellInputEvents} from '../cell/cellsWithTextDiv/dateCell/dateCellInputEvents';
import {ColumnSizerExtrinsicEvents} from '../columnSizer/columnSizerExtrinsicEvents';
import {ColumnDropdownEvents} from '../dropdown/columnDropdown/columnDropdownEvents';
import {CellWithTextEvents} from '../cell/cellsWithTextDiv/cellWithTextEvents';
import {RowDropdownEvents} from '../dropdown/rowDropdown/rowDropdownEvents';
import {ColumnDropdown} from '../dropdown/columnDropdown/columnDropdown';
import {DragColumn} from '../../utils/moveStructure/drag/dragColumn';
import {HeaderText} from '../../utils/columnDetails/headerText';
import {RowDropdown} from '../dropdown/rowDropdown/rowDropdown';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {ActiveTable} from '../../activeTable';
import {Dropdown} from '../dropdown/dropdown';

export class WindowEvents {
  public static onKeyDown(this: ActiveTable, event: KeyboardEvent) {
    if (Dropdown.isDisplayed(this._activeOverlayElements.outerContainerDropdown?.element)) {
      OuterDropdownEvents.windowOnKeyDown(this, event);
    }
    if (Dropdown.isDisplayed(this._activeOverlayElements.rowDropdown)) {
      RowDropdownEvents.windowOnKeyDown(this, event);
    }
    const {rowIndex, columnIndex, element} = this._focusedElements.cell;
    if (rowIndex === undefined || columnIndex === undefined) return;
    if (rowIndex === 0 && !Dropdown.isDisplayed(this._activeOverlayElements.columnDropdown)) {
      if (event.key === KEYBOARD_KEY.ESCAPE) {
        return HeaderText.onAttemptChange(this, element as HTMLElement, columnIndex);
      }
      // workaround for when opened dropdown does not have a focused item
    } else if (Dropdown.isDisplayed(this._activeOverlayElements.columnDropdown) && !this.shadowRoot?.activeElement) {
      return ColumnDropdownEvents.onKeyDown.bind(this)(this._activeOverlayElements.columnDropdown as HTMLElement, event);
    }
    if (rowIndex > 0 && this._columnsDetails[columnIndex].activeType.cellDropdownProps) {
      SelectCellTextBaseEvents.keyDownText(this, rowIndex, columnIndex, event);
    }
  }

  public static onKeyUp(this: ActiveTable, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      OptionColorButtonEvents.windowEventClosePicker(this._columnsDetails, this._focusedElements); // picker stops key down
      DateCellInputEvents.escapeKeyInput(this);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      OptionColorButtonEvents.windowEventClosePicker(this._columnsDetails, this._focusedElements); // picker stops key down
    }
  }

  // prettier-ignore
  public static onMouseDown(this: ActiveTable, event: MouseEvent) {
    OptionColorButtonEvents.windowEventClosePicker(this._columnsDetails, this._focusedElements);
    if (Dropdown.isDisplayed(this._activeOverlayElements.outerContainerDropdown?.element)) {
      OuterDropdownEvents.windowOnMouseDown(this);
    }
    // window event.target can only identify the parent element in shadow dom, not elements
    // inside it, hence if the user clicks inside the element, the elements inside will
    // handle the click event instead (full table overlay element for column dropdown)
    // and table element for the other closable elements  
    if ((event.target as HTMLElement).tagName === ActiveTable._ELEMENT_TAG) return;
    const {_activeOverlayElements: {columnDropdown, rowDropdown}, _focusedElements} = this
    // if the user clicks outside of the shadow dom and a dropdown is open, close it
    if (Dropdown.isDisplayed(rowDropdown)) {
      RowDropdown.hide(this);
    }
    if (Dropdown.isDisplayed(columnDropdown)) {
      ColumnDropdown.processTextAndHide(this);
    // cell blur will not activate when the dropdown has been clicked and will not close if its scrollbar or padding are
    // clicked, if clicked elsewhere on the window we close the dropdown programmatically as follows
    } else if (_focusedElements.cellDropdown) {
      CellWithTextEvents.programmaticBlur(this);
    } else if (this._activeOverlayElements.datePickerCell) {
      DateCellInputElement.toggle(this._activeOverlayElements.datePickerCell, false);
      delete this._activeOverlayElements.datePickerCell;
    }
  }

  public static onMouseUp(this: ActiveTable) {
    if (this._activeOverlayElements.selectedColumnSizer) ColumnSizerExtrinsicEvents.windowMouseUp(this);
    if (DragColumn.ACTIVE_CELL) DragColumn.windowMouseUp();
  }

  public static onMouseMove(this: ActiveTable, event: MouseEvent) {
    if (this._activeOverlayElements.selectedColumnSizer) ColumnSizerExtrinsicEvents.windowMouseMove(this, event.movementX);
    if (DragColumn.ACTIVE_CELL) DragColumn.windowDrag(DragColumn.ACTIVE_CELL, event);
  }
}
