import {ActiveTable} from '../../activeTable';
import {WindowEvents} from './windowEvents';
import {WindowResize} from './windowResize';

export class WindowElement {
  public static setEvents(at: ActiveTable) {
    window.onkeydown = WindowEvents.onKeyDown.bind(at);
    window.onkeyup = WindowEvents.onKeyUp.bind(at);
    window.onmousedown = WindowEvents.onMouseDown.bind(at);
    window.onmouseup = WindowEvents.onMouseUp.bind(at);
    window.onmousemove = WindowEvents.onMouseMove.bind(at);
    WindowResize.observeIfRequired(at);
  }
}
