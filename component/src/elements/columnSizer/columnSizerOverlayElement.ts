import {ColumnSizerOverlayEvents} from './columnSizerOverlayEvents';
import {ColumnSizerT} from '../../types/columnSizer';
import {ActiveTable} from '../../activeTable';
import {PX} from '../../types/dimensions';

// REF-12
export class ColumnSizerOverlayElement {
  private static readonly SIZER_OVERLAY_CLASS = 'column-sizer-overlay';

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(overlayElement: HTMLElement, marginRight: string, width: PX) {
    overlayElement.style.marginRight = marginRight;
    overlayElement.style.width = width;
  }

  public static applyEvents(at: ActiveTable, columnSizer: ColumnSizerT) {
    columnSizer.overlayElement.onmouseenter = ColumnSizerOverlayEvents.overlayMouseEnter.bind(at, columnSizer);
    columnSizer.overlayElement.onmouseleave = ColumnSizerOverlayEvents.overlayMouseLeave.bind(at, columnSizer);
    columnSizer.overlayElement.onmousedown = ColumnSizerOverlayEvents.overlayMouseDown.bind(at, columnSizer.element);
  }

  public static create() {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add(ColumnSizerOverlayElement.SIZER_OVERLAY_CLASS);
    return overlayElement;
  }
}
