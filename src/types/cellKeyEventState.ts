import {KEYBOARD_EVENT} from '../consts/keyboardEvents';

export type CellKeyEventState = {
  [key in KEYBOARD_EVENT]: boolean;
};
