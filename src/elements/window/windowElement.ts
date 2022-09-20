import {EditableTableComponent} from '../../editable-table-component';
import {WindowEvents} from './windowEvents';

export class WindowElement {
  public static addEvents(etc: EditableTableComponent) {
    window.onmousedown = WindowEvents.onMouseDown.bind(etc);
  }
}
