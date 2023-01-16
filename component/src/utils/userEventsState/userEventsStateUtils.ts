import {UserKeyEventsState} from '../../types/userKeyEventsState';
import {KEYBOARD_EVENT} from '../../consts/keyboardEvents';
import {KEYBOARD_KEY} from '../../consts/keyboardKeys';
import {MOUSE_EVENT} from '../../consts/mouseEvents';

export class UserKeyEventsStateUtils {
  private static readonly KEY_PRESS_STATE_TIMEOUT_ML = 5;

  public static createNew(): UserKeyEventsState {
    // REF-7
    return {[KEYBOARD_KEY.TAB]: false, [KEYBOARD_EVENT.PASTE]: false, [MOUSE_EVENT.DOWN]: false};
  }

  public static temporarilyIndicateEvent(userKeyEventsState: UserKeyEventsState, key: keyof UserKeyEventsState) {
    userKeyEventsState[key] = true;
    setTimeout(() => (userKeyEventsState[key] = false), UserKeyEventsStateUtils.KEY_PRESS_STATE_TIMEOUT_ML);
  }
}
