import {DragAndDropEvents} from './dragAndDropEvents';
import {ActiveTable} from '../../activeTable';
import {CSV} from '../../types/CSV';

export class DragAndDropElement {
  private static createOverlayElement(csv: CSV) {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'drag-and-drop-overlay';
    if (typeof csv.dragAndDrop === 'object') Object.assign(overlayElement.style, csv.dragAndDrop.overlayStyle);
    return overlayElement;
  }

  public static append(at: ActiveTable, fullTableContainer: HTMLElement) {
    const overlayElement = DragAndDropElement.createOverlayElement(at.csv as CSV);
    DragAndDropEvents.setEvents(at, fullTableContainer, overlayElement);
    fullTableContainer.appendChild(overlayElement);
  }
}
