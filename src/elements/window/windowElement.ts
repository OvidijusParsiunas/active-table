import {EditableTableComponent} from '../../editable-table-component';
import {WindowEvents} from './windowEvents';
import {WindowResize} from './windowResize';

export class WindowElement {
  public static setEvents(etc: EditableTableComponent) {
    window.onkeydown = WindowEvents.onKeyDown.bind(etc);
    window.onkeyup = WindowEvents.onKeyUp.bind(etc);
    window.onmousedown = WindowEvents.onMouseDown.bind(etc);
    window.onmouseup = WindowEvents.onMouseUp.bind(etc);
    window.onmousemove = WindowEvents.onMouseMove.bind(etc);
    WindowResize.observeIfRequired(etc);
  }
}
