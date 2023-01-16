import {KEYBOARD_EVENT} from './keyboardEvents';
import {MOUSE_EVENT} from './mouseEvents';

export type USER_KEY_EVENT = MOUSE_EVENT | KEYBOARD_EVENT;
export const USER_KEY_EVENT = {...MOUSE_EVENT, ...KEYBOARD_EVENT};
