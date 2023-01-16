import {EditableTableComponent} from '../../editable-table-component';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';

export class MoveUtils {
  // prettier-ignore
  public static setNewElementText(etc: EditableTableComponent, newText: string, targetCellElement: HTMLElement,
      columnIndex: number, rowIndex: number) {
    const oldText = CellElement.getText(targetCellElement);
    CellEvents.updateCell(etc, newText, rowIndex, columnIndex, {element: targetCellElement, processText: false});
    return oldText;
  }
}
