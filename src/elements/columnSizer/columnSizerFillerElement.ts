import {ColumnSizer} from '../../utils/columnSizer/columnSizer';
import {ColumnSizerElement} from './columnSizerElement';
import {PX} from '../../types/pxDimension';

// REF-12
// this element is used to prevent a bug where upon hovering a column sizer that is on top of a cell border
// the cell border color (e.g. black) will still remain for a short period during the expand animation
// as the transition time causes a blend effect
// this is explicitly used to cover that color without a transition period
export class ColumnSizerFillerElement {
  private static readonly SIZER_FILLER_CLASS = 'column-sizer-filler';

  public static create() {
    const fillerElement = document.createElement('div');
    fillerElement.classList.add(ColumnSizerFillerElement.SIZER_FILLER_CLASS);
    fillerElement.style.backgroundColor = ColumnSizerElement.HOVER_COLOR;
    fillerElement.style.display = 'none';
    return fillerElement;
  }

  public static setWidth(fillerElement: HTMLElement, width: PX) {
    const widthNumber = Number.parseInt(width);
    fillerElement.style.width = `${ColumnSizer.shouldWidthBeIncreased(widthNumber) ? widthNumber : 4}px`;
  }

  public static display(fillerElement: HTMLElement) {
    fillerElement.style.display = 'block';
  }

  public static hide(fillerElement: HTMLElement) {
    fillerElement.style.display = 'none';
  }
}
