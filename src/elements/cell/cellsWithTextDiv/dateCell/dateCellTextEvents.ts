import {EditableTableComponent} from '../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../dataCell/dataCellEvents';
import {DateCellInputElement} from './dateCellInputElement';
import {Browser} from '../../../../utils/browser/browser';
import {CellWithTextEvents} from '../cellWithTextEvents';
import {CellTextEvents} from '../text/cellTextEvents';
import {CellElement} from '../../cellElement';

export class DateCellTextEvents {
  private static keyDownOnText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) CellTextEvents.tabOutOfCell(this, rowIndex, columnIndex, event);
  }

  private static inputText(this: EditableTableComponent, columnIndex: number, event: Event) {
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const {activeType} = this.columnsDetails[columnIndex];
      const cellElement = CellElement.getCellElement(event.target as HTMLElement);
      DateCellInputElement.updateInputBasedOnTextDiv(cellElement, activeType);
    }
  }

  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  public static setEvents(etc: EditableTableComponent, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    textElement.onfocus = CellWithTextEvents.focusText.bind(etc, rowIndex, columnIndex, null);
    textElement.onblur = DateCellTextEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.oninput = DateCellTextEvents.inputText.bind(etc, columnIndex);
    textElement.onkeydown = DateCellTextEvents.keyDownOnText.bind(etc, rowIndex, columnIndex);
  }
}
