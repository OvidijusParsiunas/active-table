type ElementEventsNonArr = {[K in keyof HTMLElementEventMap]?: () => void};

// using arrays to allow more than one function to be added for same event
export type ElementEventsArr = {[K in keyof HTMLElementEventMap]?: (() => void)[]};

// Purpose of this is to allow to add and remove events that contain bindings
export class ElementEvents {
  public static toggleListeners(element: HTMLElement, events: ElementEventsArr, isAdd: boolean) {
    Object.keys(events).forEach((event) => {
      const eventFuncs = events[event as keyof ElementEventsArr];
      (eventFuncs || []).forEach((eventFunc) => {
        element[isAdd ? 'addEventListener' : 'removeEventListener'](event, eventFunc);
      });
    });
  }

  public static convertToArrayObj(nonArr: ElementEventsNonArr) {
    return Object.keys(nonArr).reduce<ElementEventsArr>((obj, eventName) => {
      const key = eventName as keyof HTMLElementEventMap;
      const func = nonArr[key];
      if (key && func) obj[key] = [func];
      return obj;
    }, {});
  }

  public static getDefault() {
    return {rootCell: {styles: {}}};
  }
}
