import {ElementEventsArr} from '../utils/elements/elementEvents';

// stores functions that use bindings when applied via listeners, hence keeping their references to be able to remove them
export interface EventFunctions {
  rootCell: {
    styles: ElementEventsArr;
    applied?: boolean;
  };
}
