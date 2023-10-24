import {ColumnTypesUtils} from '../columnType/columnTypesUtils';
import {CellElement} from '../../elements/cell/cellElement';
import {CellEvents} from '../../elements/cell/cellEvents';
import {ActiveTable} from '../../activeTable';

export class MoveUtils {
  // prettier-ignore
  public static setNewElementText(at: ActiveTable, newText: string, targetCellElement: HTMLElement,
      columnIndex: number, rowIndex: number) {
    const oldText = CellElement.getText(targetCellElement);
    CellEvents.updateCell(at, newText, rowIndex, columnIndex, {element: targetCellElement, processText: false});
    ColumnTypesUtils.updateDataElements(at, rowIndex, columnIndex, targetCellElement);
    return oldText;
  }
}
