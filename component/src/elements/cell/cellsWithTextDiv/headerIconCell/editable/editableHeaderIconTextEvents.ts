import {HeaderText} from '../../../../../utils/columnDetails/headerText';
import {DataCellEvents} from '../../../dataCell/dataCellEvents';
import {KEYBOARD_KEY} from '../../../../../consts/keyboardKeys';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellTextEvents} from '../../text/cellTextEvents';
import {ActiveTable} from '../../../../../activeTable';
import {CellElement} from '../../../cellElement';

export class EditableHeaderIconTextEvents {
  private static keyDownOnText(this: ActiveTable, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) CellTextEvents.tabOutOfCell(this, rowIndex, columnIndex, event);
  }

  // REF-15
  private static blurText(this: ActiveTable, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    const cellElement = CellElement.getCellElement(textElement);
    HeaderText.onAttemptChange(this, cellElement, columnIndex);
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  public static setEvents(at: ActiveTable, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!at._columnsDetails[columnIndex].settings.isHeaderTextEditable) return;
    textElement.onfocus = CellWithTextEvents.focusText.bind(at, rowIndex, columnIndex, null);
    textElement.onblur = EditableHeaderIconTextEvents.blurText.bind(at, rowIndex, columnIndex);
    textElement.onkeydown = EditableHeaderIconTextEvents.keyDownOnText.bind(at, rowIndex, columnIndex);
  }
}
