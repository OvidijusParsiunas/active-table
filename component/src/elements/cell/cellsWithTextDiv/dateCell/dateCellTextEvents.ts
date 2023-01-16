import {KEYBOARD_KEY} from '../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../dataCell/dataCellEvents';
import {DateCellInputElement} from './dateCellInputElement';
import {Browser} from '../../../../utils/browser/browser';
import {CellWithTextEvents} from '../cellWithTextEvents';
import {CellTextEvents} from '../text/cellTextEvents';
import {ActiveTable} from '../../../../activeTable';
import {CellElement} from '../../cellElement';

export class DateCellTextEvents {
  private static keyDownOnText(this: ActiveTable, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) CellTextEvents.tabOutOfCell(this, rowIndex, columnIndex, event);
  }

  private static inputText(this: ActiveTable, columnIndex: number, event: Event) {
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      const {activeType} = this.columnsDetails[columnIndex];
      const cellElement = CellElement.getCellElement(event.target as HTMLElement);
      DateCellInputElement.updateInputBasedOnTextDiv(cellElement, activeType);
    }
  }

  private static blurText(this: ActiveTable, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  public static setEvents(at: ActiveTable, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!at.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    textElement.onfocus = CellWithTextEvents.focusText.bind(at, rowIndex, columnIndex, null);
    textElement.onblur = DateCellTextEvents.blurText.bind(at, rowIndex, columnIndex);
    textElement.oninput = DateCellTextEvents.inputText.bind(at, columnIndex);
    textElement.onkeydown = DateCellTextEvents.keyDownOnText.bind(at, rowIndex, columnIndex);
  }
}
