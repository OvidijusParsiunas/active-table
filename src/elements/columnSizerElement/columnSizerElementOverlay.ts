import {ColumnSizer} from '../../utils/columnSizer/columnSizer';
import {ColumnSizerElement} from './columnSizerElement';
import {PX} from '../../types/pxDimension';

export class ColumnSizerElementOverlay {
  // this is almost a fully transparent color in order ot allow the column sizer on click animation to change color
  // using any transition period and overlay would not stand out
  private static readonly MOUSE_DOWN_BACKGROUND_COLOR = '#ffffff01';

  // this element is used to prevent a bug where upon hovering a column sizer that is on top of a cell border
  // the cell border color (e.g. black) will still remain for a short period during the expand animation
  // as the transition time causes a blend effect
  // this is explicitly used to cover that color without a transition period
  public static create() {
    const overlayElement = document.createElement('div');
    ColumnSizerElementOverlay.setDefaultColor(overlayElement);
    overlayElement.classList.add('column-sizer-overlay');
    overlayElement.style.display = 'none';
    return overlayElement;
  }

  public static setDefaultColor(overlayElement: HTMLElement) {
    overlayElement.style.backgroundColor = ColumnSizerElement.HOVER_COLOR;
  }

  public static setMouseDownColor(overlayElement: HTMLElement) {
    overlayElement.style.backgroundColor = ColumnSizerElementOverlay.MOUSE_DOWN_BACKGROUND_COLOR;
  }

  public static setWidth(overlayElement: HTMLElement, width: PX) {
    const widthNumber = Number.parseInt(width);
    overlayElement.style.width = `${ColumnSizer.shouldWidthBeIncreased(widthNumber) ? widthNumber : 4}px`;
  }

  public static display(overlayElement: HTMLElement) {
    overlayElement.style.display = 'block';
  }

  public static hide(overlayElement: HTMLElement) {
    overlayElement.style.display = 'none';
  }
}
