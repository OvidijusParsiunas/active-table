import {EditableTableComponent} from '../../editable-table-component';
import {WindowEvents} from './windowEvents';

export class WindowElement {
  public static setEvents(etc: EditableTableComponent) {
    window.onmousedown = WindowEvents.onMouseDown.bind(etc);
  }
}
