import {FocusNextCellFromSelectCell} from '../../../../../utils/focusedElements/focusNextCellFromSelectCell';
import {SelectDropdownItem} from '../../../../dropdown/selectDropdown/selectDropdownItem';
import {SelectDropdown} from '../../../../dropdown/selectDropdown/selectDropdown';
import {EditableTableComponent} from '../../../../../editable-table-component';
import {ArrowDownIconElement} from '../select/arrowDownIconElement';
import {KEYBOARD_KEY} from '../../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../../dataCell/dataCellEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellTextEvents} from '../../text/cellTextEvents';
import {Dropdown} from '../../../../dropdown/dropdown';
import {CellElement} from '../../../cellElement';
import {SelectCell} from '../selectCell';

// used for both - select and label cell text events
export class SelectCellTextBaseEvents {
  // the reason why this is triggered by window is because when the user clicks on dropdown padding or delete button
  // keydown events will no longer be fired through the cell text - however we need to maintain the same behaviour
  // prettier-ignore
  public static keyDownText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {selectDropdown: {activeItems, canAddMoreOptions}, elements} = etc.columnsDetails[columnIndex];
    if (event.key === KEYBOARD_KEY.ESCAPE) {
      CellWithTextEvents.programmaticBlur(etc);
    } else if (event.key === KEYBOARD_KEY.TAB) {
      CellTextEvents.tabOutOfCell(etc, rowIndex, columnIndex, event);
    } else if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      FocusNextCellFromSelectCell.focusOrBlurSelectNextCell(elements, rowIndex);
    } else if (event.key === KEYBOARD_KEY.ARROW_UP) {
      event.preventDefault();
      SelectDropdownItem.setSiblingItemOnCell(etc, activeItems, 'previousSibling');
    } else if (event.key === KEYBOARD_KEY.ARROW_DOWN) {
      event.preventDefault();
      SelectDropdownItem.setSiblingItemOnCell(etc, activeItems, 'nextSibling');
    } else if (!canAddMoreOptions) {
      event.preventDefault();
    }
  }

  private static displayDropdown(etc: EditableTableComponent, columnIndex: number, cellElement: HTMLElement) {
    const isDisplayed = SelectDropdown.display(etc, columnIndex, cellElement);
    const {activeType, selectDropdown} = etc.columnsDetails[columnIndex];
    if (activeType.selectProps?.isBasicSelect && isDisplayed) {
      selectDropdown.displayedCellElement = cellElement;
      ArrowDownIconElement.toggle(cellElement, true);
    }
  }

  public static blurring(etc: EditableTableComponent, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const {selectDropdown, activeType} = etc.columnsDetails[columnIndex];
    Dropdown.hide(selectDropdown.element);
    if (!selectDropdown.selectItem[CellElement.getText(textElement)]) {
      SelectCell.finaliseEditedText(etc, textElement, columnIndex);
    }
    if (activeType.selectProps?.isBasicSelect) {
      ArrowDownIconElement.toggle(selectDropdown.displayedCellElement, false);
      delete selectDropdown.displayedCellElement;
    }
    DataCellEvents.blur(etc, rowIndex, columnIndex, textElement);
  }

  public static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    if (!this.focusedElements.selectDropdown) {
      SelectCellTextBaseEvents.blurring(this, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    textElement.onblur = SelectCellTextBaseEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = CellWithTextEvents.focusText.bind(
      etc, rowIndex, columnIndex, SelectCellTextBaseEvents.displayDropdown);
  }
}
