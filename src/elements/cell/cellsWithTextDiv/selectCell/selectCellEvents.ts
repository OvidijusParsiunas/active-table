import {FocusNextCellFromSelectCell} from '../../../../utils/focusedElements/focusNextCellFromSelectCell';
import {SelectDropdownItem} from '../../../dropdown/selectDropdown/selectDropdownItem';
import {SelectDropdown} from '../../../dropdown/selectDropdown/selectDropdown';
import {EditableTableComponent} from '../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../dataCell/dataCellEvents';
import {CellWithTextEvents} from '../cellWithTextEvents';
import {CellTextEvents} from '../text/cellTextEvents';
import {SelectCellElement} from './selectCellElement';
import {Dropdown} from '../../../dropdown/dropdown';
import {CellElement} from '../../cellElement';

// the logic for cell and text divs is handled here
export class SelectCellEvents {
  // the reason why this is triggered by window is because when the user clicks on dropdown padding or delete button
  // keydown events will no longer be fired through the cell text - however we need to maintain the same behaviour
  // prettier-ignore
  public static keyDownText(etc: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    const {selectDropdown: {activeItems}, elements} = etc.columnsDetails[columnIndex];
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
    }
  }

  public static blurring(etc: EditableTableComponent, rowIndex: number, columnIndex: number, textElement: HTMLElement) {
    const {element, selectItem} = etc.columnsDetails[columnIndex].selectDropdown;
    Dropdown.hide(element);
    if (!selectItem[CellElement.getText(textElement)]) {
      SelectCellElement.finaliseEditedText(etc, textElement, columnIndex);
    }
    DataCellEvents.blur(etc, rowIndex, columnIndex, textElement);
  }

  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    if (!this.focusedElements.selectDropdown) {
      SelectCellEvents.blurring(this, rowIndex, columnIndex, event.target as HTMLElement);
    }
  }

  private static blurIfDropdownFocused(etc: EditableTableComponent) {
    // text blur will not activate when the dropdown has been clicked and will not close if its scrollbar, padding
    // or delete select buttons are clicked, hence once that happens and the user clicks on another select cell,
    // the dropdown is closed programmatically as follows
    if (etc.focusedElements.selectDropdown) {
      CellWithTextEvents.programmaticBlur(etc);
    }
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    // these are used in date cells and overwritten when converted from
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.onmousedown = CellWithTextEvents.mouseDownCell.bind(etc, SelectCellEvents.blurIfDropdownFocused);
    const textElement = cellElement.children[0] as HTMLElement;
    textElement.onblur = SelectCellEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.onfocus = CellWithTextEvents.focusText.bind(etc, rowIndex, columnIndex, SelectDropdown.display);
  }
}
