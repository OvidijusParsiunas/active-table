import {ColumnSizer} from '../../utils/columnSizer/columnSizer';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {ColumnSizerElement} from './columnSizerElement';
import {PX} from '../../types/pxDimension';

// this element is used to prevent a bug where upon hovering a column sizer that is on top of a cell border
// the cell border color (e.g. black) will still remain for a short period during the expand animation
// as the transition time causes a blend effect
// this is explicitly used to cover that color without a transition period
export class ColumnSizerElementOverlay {
  public static setDefaultColor(overlayElement: HTMLElement, customColor?: string) {
    overlayElement.style.backgroundColor = customColor || ColumnSizerElement.DEFAULT_COLOR;
  }

  public static create(customHoverColor?: string) {
    const overlayElement = document.createElement('div');
    ColumnSizerElementOverlay.setDefaultColor(overlayElement, customHoverColor);
    overlayElement.classList.add('column-sizer-overlay');
    overlayElement.style.display = 'none';
    return overlayElement;
  }

  public static setMouseDownColor(overlayElement: HTMLElement) {
    // this is almost a fully transparent color that allows the column sizer on click animation to change color
    // using any transition period and not cause overlay to stand out
    overlayElement.style.backgroundColor = SEMI_TRANSPARENT_COLOR;
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
