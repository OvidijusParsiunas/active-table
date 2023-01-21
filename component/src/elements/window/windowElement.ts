import {ActiveTable} from '../../activeTable';
import {WindowEvents} from './windowEvents';
import {WindowResize} from './windowResize';

export class WindowElement {
  public static setEvents(at: ActiveTable) {
    window.addEventListener('keydown', WindowEvents.onKeyDown.bind(at));
    window.addEventListener('keyup', WindowEvents.onKeyUp.bind(at));
    window.addEventListener('mousedown', WindowEvents.onMouseDown.bind(at));
    window.addEventListener('mouseup', WindowEvents.onMouseUp.bind(at));
    window.addEventListener('mousemove', WindowEvents.onMouseMove.bind(at));
    WindowResize.observeIfRequired(at);
  }
}
