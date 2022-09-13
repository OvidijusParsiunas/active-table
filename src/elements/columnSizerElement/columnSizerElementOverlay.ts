import {ColumnSizerElement} from './columnSizerElement';

export class ColumnSizerElementOverlay {
  // this element is used to prevent a bug where upon hovering a column sizer that is on top of a cell border
  // the cell border color (e.g. black) will still remain for a short period during the expand animation
  // as the transition time causes a blend effect
  // this is explicitly used to cover that color without a transition period
  public static create() {
    const overlayElement = document.createElement('div');
    // WORK - inherit width
    overlayElement.style.width = '4px';
    overlayElement.style.display = 'none';
    overlayElement.style.height = 'inherit';
    overlayElement.style.position = 'absolute';
    overlayElement.style.pointerEvents = 'none';
    overlayElement.style.backgroundColor = ColumnSizerElement.HOVER_COLOR;
    return overlayElement;
  }

  public static display(overlayElement: HTMLElement) {
    overlayElement.style.display = 'block';
  }

  public static hide(overlayElement: HTMLElement) {
    overlayElement.style.display = 'none';
  }
}
