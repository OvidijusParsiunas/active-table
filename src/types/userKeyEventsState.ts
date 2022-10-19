import {USER_KEY_EVENT} from '../consts/userKeyEvents';

export type UserKeyEventsState = {
  [key in USER_KEY_EVENT]: boolean;
};
