import {ColumnSizersStates, ColumnSizerState} from '../../types/overlayElements';
import {ColumnSizerEvents} from './columnSizerEvents';

export class ColumnSizerElements {
  private static createElement() {
    const borderWidthLine = document.createElement('div');
    borderWidthLine.classList.add('column-width-sizer');
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
