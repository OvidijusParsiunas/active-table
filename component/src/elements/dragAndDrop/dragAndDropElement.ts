import {DragAndDropEvents} from './dragAndDropEvents';
import {ActiveTable} from '../../activeTable';
import {Files} from '../../types/files';

export class DragAndDropElement {
  private static createOverlayElement(files: Files) {
    const overlayElement = document.createElement('div');
    overlayElement.id = 'drag-and-drop-overlay';
    if (typeof files.dragAndDrop === 'object') Object.assign(overlayElement.style, files.dragAndDrop.overlayStyle);
    return overlayElement;
  }

  public static append(at: ActiveTable, fullTableContainer: HTMLElement) {
    const overlayElement = DragAndDropElement.createOverlayElement(at.files as Files);
    DragAndDropEvents.setEvents(at, fullTableContainer, overlayElement);
    fullTableContainer.appendChild(overlayElement);
  }
}
