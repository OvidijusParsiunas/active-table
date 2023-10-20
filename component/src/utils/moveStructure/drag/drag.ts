import {FocusedCellUtils} from '../../focusedElements/focusedCellUtils';
import {ActiveTable} from '../../../activeTable';

type MoveFunc = (at: ActiveTable, columnIndex: number, isToRight: boolean) => void;

export class Drag {
  protected static readonly CELL_HIDDEN_CLASS = 'cell-hidden';
  protected static readonly DRAG_PX_TO_MOVE = 10;
  protected static ORIGINAL_INDEX = 0;

  protected static move(at: ActiveTable, moveByNumber: number, move: MoveFunc) {
    if (moveByNumber === 0) return;
    const isMoveDown = moveByNumber > 0;
    const delta = isMoveDown ? 1 : -1;
    for (let i = 0; i < Math.abs(moveByNumber); i += 1) {
      move(at, Drag.ORIGINAL_INDEX + i * delta, isMoveDown);
    }
    // in timeout to allow move to finish processing
    setTimeout(() => FocusedCellUtils.purge(at._focusedElements.cell), 5);
  }
}
