import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerOverlayEvents} from './columnSizerOverlayEvents';
import {ColumnSizerT} from '../../types/columnSizer';
import {PX} from '../../types/pxDimension';

// REF-12
export class ColumnSizerOverlayElement {
  private static readonly SIZER_OVERLAY_CLASS = 'column-sizer-overlay';

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(overlayElement: HTMLElement, marginRight: string, width: PX) {
    overlayElement.style.marginRight = marginRight;
    overlayElement.style.width = width;
  }

  public static applyEvents(etc: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.overlayElement.onmouseenter = ColumnSizerOverlayEvents.overlayMouseEnter.bind(etc, columnSizer);
    columnSizer.overlayElement.onmouseleave = ColumnSizerOverlayEvents.overlayMouseLeave.bind(etc, columnSizer);
    columnSizer.overlayElement.onmousedown = ColumnSizerOverlayEvents.overlayMouseDown.bind(etc, columnSizer.element);
  }

  public static create() {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add(ColumnSizerOverlayElement.SIZER_OVERLAY_CLASS);
    return overlayElement;
  }
}
