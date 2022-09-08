import {ColumnSizersStates, ColumnSizerState} from '../../types/overlayElements';
import {ColumnSizerEvents} from './columnSizerEvents';

export class ColumnSizerElements {
  public static readonly BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';

  private static createElement() {
    const borderWidthLine = document.createElement('div');
    borderWidthLine.classList.add('column-width-sizer');
    borderWidthLine.style.backgroundImage = ColumnSizerElements.BACKGROUND_IMAGE;
    return borderWidthLine;
  }

  public static createNew(overlayElementsParentElement: HTMLElement, columnSizers: ColumnSizersStates) {
    const columnSizerElement = ColumnSizerElements.createElement();
    const columnSizerState: ColumnSizerState = {element: columnSizerElement, isMouseHovered: false};
    columnSizerElement.onmouseenter = ColumnSizerEvents.onMouseEnter.bind(this, columnSizerState);
    columnSizerElement.onmouseleave = ColumnSizerEvents.onMouseLeave.bind(this, columnSizerState);
    overlayElementsParentElement.appendChild(columnSizerElement);
    columnSizers.push(columnSizerState);
  }
}
