import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerOverlayEvents} from './columnSizerOverlayEvents';
import {ColumnSizerT} from '../../types/columnSizer';

export class ColumnSizerOverlayElement {
  private static readonly OVERLAY_ELEMENT = 'column-sizer-overlay';

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(movableSizerElement: HTMLElement, marginRight: string) {
    movableSizerElement.style.marginRight = marginRight;
  }

  public static applyEvents(etc: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.overlayElement.onmouseenter = ColumnSizerOverlayEvents.overlayMouseEnter.bind(etc, columnSizer);
    columnSizer.overlayElement.onmouseleave = ColumnSizerOverlayEvents.overlayMouseLeave.bind(etc, columnSizer);
    columnSizer.overlayElement.onmousedown = ColumnSizerOverlayEvents.overlayMouseDown.bind(etc, columnSizer.element.id);
  }

  public static create() {
    const overlayElement = document.createElement('div');
    // WORK - width will need to be dynamic and tested with
    overlayElement.style.width = '7px';
    overlayElement.classList.add(ColumnSizerOverlayElement.OVERLAY_ELEMENT);
    return overlayElement;
  }
}
