import {ColumnSizerElement} from './columnSizerElement';
import {ColumnSizerState} from './columnSizerState';

export class ColumnSizerElementOverlay {
  // this element is used to prevent a bug where upon hovering a column sizer that is on top of a cell border
  // the cell border color (e.g. black) will still remain for a short period during the expand animation
  // as the transition time causes a blend effect
  // this is explicitly used to cover that color without a transition period
  public static create() {
    // WORK - refactor
    const overlayElement = document.createElement('div');
    overlayElement.style.display = 'none';
    overlayElement.style.height = 'inherit';
    overlayElement.style.position = 'absolute';
    overlayElement.style.pointerEvents = 'none';
    overlayElement.style.backgroundColor = ColumnSizerElement.HOVER_COLOR;
    return overlayElement;
  }

  public static setWidth(overlayElement: HTMLElement, width: string) {
    const widthNumber = Number.parseInt(width);
    overlayElement.style.width = `${ColumnSizerState.shouldWidthBeIncreased(widthNumber) ? widthNumber : 4}px`;
  }

  public static display(overlayElement: HTMLElement) {
    overlayElement.style.display = 'block';
  }

  public static hide(overlayElement: HTMLElement) {
    overlayElement.style.display = 'none';
  }
}
