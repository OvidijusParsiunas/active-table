import {EditableTableComponent} from '../../../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../../../consts/keyboardKeys';
import {DataCellEvents} from '../../../dataCell/dataCellEvents';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {CellTextEvents} from '../../text/cellTextEvents';

export class EditableHeaderIconTextEvents {
  private static keyDownOnText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.TAB) CellTextEvents.tabOutOfCell(this, rowIndex, columnIndex, event);
  }

  private static blurText(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: FocusEvent) {
    const textElement = event.target as HTMLElement;
    DataCellEvents.blur(this, rowIndex, columnIndex, textElement);
  }

  public static setEvents(etc: EditableTableComponent, textElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isHeaderTextEditable) return;
    textElement.onfocus = CellWithTextEvents.focusText.bind(etc, rowIndex, columnIndex, null);
    textElement.onblur = EditableHeaderIconTextEvents.blurText.bind(etc, rowIndex, columnIndex);
    textElement.onkeydown = EditableHeaderIconTextEvents.keyDownOnText.bind(etc, rowIndex, columnIndex);
  }
}
