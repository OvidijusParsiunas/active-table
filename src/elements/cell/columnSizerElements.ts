import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerState} from '../../types/overlayElements';
import {ColumnSizerEvents} from './columnSizerEvents';

export class ColumnSizerElements {
  private static readonly BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  public static readonly COLUMN_WIDTH_SIZER_CLASS = 'column-width-sizer';
  private static readonly COLUMN_WIDTH_SIZER_ID_PREFIX = 'width-sizer-';
  private static readonly TRANSITION_TIME_ML = 200;
  private static readonly TRANSITION_TIME = `${ColumnSizerElements.TRANSITION_TIME_ML / 1000}s`;
  private static readonly HALF_TRANSITION_TIME_ML = ColumnSizerElements.TRANSITION_TIME_ML / 2;

  public static setBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = ColumnSizerElements.BACKGROUND_IMAGE;
  }

  public static unsetBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = 'none';
  }

  private static createElement(widthSizerIndex: number) {
    const columnSizerElement = document.createElement('div');
    columnSizerElement.id = `${ColumnSizerElements.COLUMN_WIDTH_SIZER_ID_PREFIX}${widthSizerIndex}`;
    columnSizerElement.classList.add(ColumnSizerElements.COLUMN_WIDTH_SIZER_CLASS);
    ColumnSizerElements.setBackgroundImage(columnSizerElement);
    return columnSizerElement;
  }

  // prettier-ignore
  public static createAndAddNew(etc: EditableTableComponent) {
    const { overlayElementsParentRef, overlayElements: { columnSizers } } = etc;
    const columnSizerElement = ColumnSizerElements.createElement(columnSizers.length);
    const columnSizerState: ColumnSizerState = {element: columnSizerElement, isMouseHovered: false};
    columnSizerElement.onmouseenter = ColumnSizerEvents.onMouseEnter.bind(etc, columnSizerState);
    columnSizerElement.onmouseleave = ColumnSizerEvents.onMouseLeave.bind(etc, columnSizerState);
    (overlayElementsParentRef as HTMLElement).appendChild(columnSizerElement);
    columnSizers.push(columnSizerState);
  }

  public static display(headerCell: HTMLElement, cellRect: DOMRect, columnSizerElement: HTMLElement, left: string) {
    columnSizerElement.style.height = `${headerCell.offsetHeight}px`;
    columnSizerElement.style.top = `${cellRect.top}px`;
    columnSizerElement.style.left = left;
    columnSizerElement.style.display = 'block';
  }

  public static hide(etc: EditableTableComponent, columnIndex: number) {
    const columnSizerLeft = etc.overlayElements.columnSizers[columnIndex - 1];
    const columnSizerRight = etc.overlayElements.columnSizers[columnIndex];
    setTimeout(() => {
      if (columnSizerLeft && !columnSizerLeft.isMouseHovered) columnSizerLeft.element.style.display = 'none';
      if (!columnSizerRight.isMouseHovered) columnSizerRight.element.style.display = 'none';
    });
  }

  public static setLeftProp(columnSizerElement: HTMLElement, colLeft: number, colWidth: number, newXMovement: number) {
    const newLeft = `${colLeft + colWidth + newXMovement}px`;
    columnSizerElement.style.left = newLeft;
  }

  public static setSyncDefaultProperties(columnSizerElement: HTMLElement) {
    columnSizerElement.style.width = `1px`;
    columnSizerElement.style.marginLeft = `0px`;
    columnSizerElement.style.cursor = ``;
    columnSizerElement.style.backgroundColor = ``;
  }

  public static setTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = ColumnSizerElements.TRANSITION_TIME;
  }

  public static unsetTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = `0.0s`;
  }

  public static setAsyncDefaultProperties(columnSizerElement: HTMLElement) {
    setTimeout(() => {
      ColumnSizerElements.setBackgroundImage(columnSizerElement);
      setTimeout(() => {
        ColumnSizerElements.unsetTransitionTime(columnSizerElement);
      }, ColumnSizerElements.HALF_TRANSITION_TIME_ML);
    }, ColumnSizerElements.HALF_TRANSITION_TIME_ML);
  }

  public static setHoverProperties(columnSizerElement: HTMLElement) {
    ColumnSizerElements.setTransitionTime(columnSizerElement);
    columnSizerElement.style.width = `7px`;
    columnSizerElement.style.marginLeft = `-3px`;
    columnSizerElement.style.backgroundColor = `grey`;
    columnSizerElement.style.cursor = `col-resize`;
  }
}
