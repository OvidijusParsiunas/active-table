import {FocusNextRowCell} from '../../../../../utils/focusedElements/focusNextRowCell';
import {CellDropdownItem} from '../../../../dropdown/cellDropdown/cellDropdownItem';
import {OptionButton} from '../../../../dropdown/cellDropdown/buttons/optionButton';
import {ColumnDetailsT, ColumnsDetailsT} from '../../../../../types/columnDetails';
import {CellDropdown} from '../../../../dropdown/cellDropdown/cellDropdown';
import {ArrowDownIconElement} from '../select/arrowDownIconElement';
import {KEYBOARD_KEY} from '../../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../../dataCell/dataCellEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellTextEvents} from '../../text/cellTextEvents';
import {ActiveTable} from '../../../../../activeTable';
import {Dropdown} from '../../../../dropdown/dropdown';
import {CellElement} from '../../../cellElement';
import {SelectCell} from '../selectCell';

// used for both - select and label cell text events
export class SelectCellTextBaseEvents {
  // the reason why this is triggered by window is because when the user clicks on dropdown padding or delete button
  // keydown events will no longer be fired through the cell text - however we need to maintain the same behaviour
  // prettier-ignore
  public static keyDownText(at: ActiveTable, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {cellDropdown: {activeItems, canAddMoreOptions}, elements} = at._columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      CellWithTextEvents.programmaticBlur(at);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      CellTextEvents.tabOutOfCell(at, rowIndex, columnIndex, event);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      FocusNextRowCell.focusOrBlurSelect(elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      CellDropdownItem.setSiblingItemOnCell(at, activeItems, 'previousSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      CellDropdownItem.setSiblingItemOnCell(at, activeItems, 'nextSibling');
    } else if ((at.dataStartsAtHeader || rowIndex > 0) && !canAddMoreOptions) {
      event.preventDefault();
    }
  }

  private static displayDropdown(at: ActiveTable, columnIndex: number, cellElement: HTMLElement) {
    const isDisplayed = CellDropdown.display(at, columnIndex, cellElement);
    const {activeType, cellDropdown} = at._columnsDetails[columnIndex];
    if (activeType.cellDropdownProps?.isBasicSelect && isDisplayed) {
      cellDropdown.displayedCellElement = cellElement;
      ArrowDownIconElement.toggle(cellElement, true);
      ArrowDownIconElement.setActive(cellElement);
    }
  }

  private static clearTypeSpecificProps(columnsDetails: ColumnsDetailsT, columnDetails: ColumnDetailsT) {
    const {cellDropdown, activeType} = columnDetails;
    if (!activeType.cellDropdownProps) return;
    if (activeType.cellDropdownProps.isBasicSelect) {
      ArrowDownIconElement.toggle(cellDropdown.displayedCellElement, false);
      delete cellDropdown.displayedCellElement;
    } else {
      OptionButton.hideAfterColorPickerContainerClose(columnsDetails, columnDetails);
    }
  }

  public static blurring(at: ActiveTable, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const columnDetails = at._columnsDetails[columnIndex];
    Dropdown.hide(columnDetails.cellDropdown.element);
    if (!columnDetails.cellDropdown.itemsDetails[CellElement.getText(textElement)]) {
      SelectCell.finaliseEditedText(at, textElement, columnIndex);
    }
    SelectCellTextBaseEvents.clearTypeSpecificProps(at._columnsDetails, columnDetails);
    DataCellEvents.blur(at, rowIndex, columnIndex, textElement);
  }

  public static blurText(this: ActiveTable, rowIndex: number, columnIndex: number, event: Event) {
    if (!this._focusedElements.cellDropdown) {
      SelectCellTextBaseEvents.blurring(this, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  // prettier-ignore
  public static setEvents(at: ActiveTable, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    textElement.onblur = SelectCellTextBaseEvents.blurText.bind(at, rowIndex, columnIndex);
    textElement.onfocus = CellWithTextEvents.focusText.bind(
      at, rowIndex, columnIndex, SelectCellTextBaseEvents.displayDropdown);
  }
}
