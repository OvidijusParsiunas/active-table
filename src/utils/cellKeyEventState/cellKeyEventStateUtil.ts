import {CellKeyEventState} from '../../types/cellKeyEventState';
import {KEYBOARD_EVENT} from '../../consts/keyboardEvents';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';

export class CellKeyEventStateUtil {
  private static readonly CELL_KEY_PRESS_STATE_TIMEOUT_ML = 5;

  public static createNew(): CellKeyEventState {
    // REF-7
    return {[KEYBOARD_KEY.TAB]: false, [KEYBOARD_EVENT.PASTE]: false};
  }

  public static temporarilyIndicateEvent(cellKeyEventState: CellKeyEventState, key: keyof CellKeyEventState) {
    cellKeyEventState[key] = true;
    setTimeout(() => (cellKeyEventState[key] = false), CellKeyEventStateUtil.CELL_KEY_PRESS_STATE_TIMEOUT_ML);
  }
}
