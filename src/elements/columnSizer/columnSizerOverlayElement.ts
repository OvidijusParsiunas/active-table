import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerOverlayEvents} from './columnSizerOverlayEvents';
import {ColumnSizer} from '../../utils/columnSizer/columnSizer';
import {ColumnSizerT} from '../../types/columnSizer';
import {PX} from '../../types/pxDimension';

export class ColumnSizerOverlayElement {
  private static readonly OVERLAY_ELEMENT = 'column-sizer-overlay';

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(overlayElement: HTMLElement, marginRight: string, width: PX) {
    overlayElement.style.marginRight = marginRight;
    const widthNumber = Number.parseInt(width);
    overlayElement.style.width = `${ColumnSizer.shouldWidthBeIncreased(widthNumber) ? widthNumber - 2 : widthNumber}px`;
  }

  public static applyEvents(etc: EditableTableComponent, columnSizer: ColumnSizerT) {
    columnSizer.overlayElement.onmouseenter = ColumnSizerOverlayEvents.overlayMouseEnter.bind(etc, columnSizer);
    columnSizer.overlayElement.onmouseleave = ColumnSizerOverlayEvents.overlayMouseLeave.bind(etc, columnSizer);
    columnSizer.overlayElement.onmousedown = ColumnSizerOverlayEvents.overlayMouseDown.bind(etc, columnSizer.element.id);
  }

  public static create() {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add(ColumnSizerOverlayElement.OVERLAY_ELEMENT);
    return overlayElement;
  }
}
