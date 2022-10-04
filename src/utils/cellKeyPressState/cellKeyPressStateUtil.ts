import {CellKeyPressState} from '../../types/cellKeyPressState';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';

// REF-7
export class CellKeyPressStateUtil {
  private static readonly CELL_KEY_PRESS_STATE_TIMEOUT_ML = 5;

  public static createNew(): CellKeyPressState {
    return {[KEYBOARD_KEY.TAB]: false};
  }

  public static temporarilyIndicatePress(cellKeyPressState: CellKeyPressState, key: keyof CellKeyPressState) {
    cellKeyPressState[key] = true;
    setTimeout(() => (cellKeyPressState[key] = false), CellKeyPressStateUtil.CELL_KEY_PRESS_STATE_TIMEOUT_ML);
  }
}
