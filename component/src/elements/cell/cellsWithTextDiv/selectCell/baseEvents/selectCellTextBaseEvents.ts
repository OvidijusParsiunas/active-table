import {FocusNextCellFromSelectCell} from '../../../../../utils/focusedElements/focusNextCellFromSelectCell';
import {SelectDropdownItem} from '../../../../dropdown/selectDropdown/selectDropdownItem';
import {SelectButton} from '../../../../dropdown/selectDropdown/buttons/selectButton';
import {SelectDropdown} from '../../../../dropdown/selectDropdown/selectDropdown';
import {ArrowDownIconElement} from '../select/arrowDownIconElement';
import {ColumnDetailsT} from '../../../../../types/columnDetails';
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
    const {selectDropdown: {activeItems, canAddMoreOptions}, elements} = at.columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      CellWithTextEvents.programmaticBlur(at);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      CellTextEvents.tabOutOfCell(at, rowIndex, columnIndex, event);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      FocusNextCellFromSelectCell.focusOrBlurSelectNextCell(elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      SelectDropdownItem.setSiblingItemOnCell(at, activeItems, 'previousSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      SelectDropdownItem.setSiblingItemOnCell(at, activeItems, 'nextSibling');
    } else if ((at.dataStartsAtHeader || rowIndex > 0) && !canAddMoreOptions) {
      event.preventDefault();
    }
  }

  private static displayDropdown(at: ActiveTable, columnIndex: number, cellElement: HTMLElement) {
    const isDisplayed = SelectDropdown.display(at, columnIndex, cellElement);
    const {activeType, selectDropdown} = at.columnsDetails[columnIndex];
    if (activeType.selectProps?.isBasicSelect && isDisplayed) {
      selectDropdown.displayedCellElement = cellElement;
      ArrowDownIconElement.toggle(cellElement, true);
    }
  }

  private static clearTypeSpecificProps(columnDetails: ColumnDetailsT) {
    const {selectDropdown, activeType} = columnDetails;
    if (!activeType.selectProps) return;
    if (activeType.selectProps.isBasicSelect) {
      ArrowDownIconElement.toggle(selectDropdown.displayedCellElement, false);
      delete selectDropdown.displayedCellElement;
    } else {
      SelectButton.hideAfterColorPickerContainerClose(columnDetails);
    }
  }

  public static blurring(at: ActiveTable, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const columnDetails = at.columnsDetails[columnIndex];
    Dropdown.hide(columnDetails.selectDropdown.element);
    if (!columnDetails.selectDropdown.itemsDetails[CellElement.getText(textElement)]) {
      SelectCell.finaliseEditedText(at, textElement, columnIndex);
    }
    SelectCellTextBaseEvents.clearTypeSpecificProps(columnDetails);
    DataCellEvents.blur(at, rowIndex, columnIndex, textElement);
  }

  public static blurText(this: ActiveTable, rowIndex: number, columnIndex: number, event: Event) {
    if (!this.focusedElements.selectDropdown) {
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
