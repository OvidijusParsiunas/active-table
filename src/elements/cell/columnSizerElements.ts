import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerEvents} from './columnSizerEvents';

// the reason why there are multiple column sizers is because sometimes the user may hover over it before hovering
// over a cell e.g from top/below
export class ColumnSizerElements {
  private static readonly BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  private static readonly HOVER_BACKGROUND_IMAGE = 'none';
  public static readonly COLUMN_WIDTH_SIZER_CLASS = 'column-width-sizer';
  private static readonly COLUMN_WIDTH_SIZER_ID_PREFIX = 'width-sizer-';
  private static readonly TRANSITION_TIME_ML = 200;
  private static readonly TRANSITION_TIME = `${ColumnSizerElements.TRANSITION_TIME_ML / 1000}s`;
  private static readonly HALF_TRANSITION_TIME_ML = ColumnSizerElements.TRANSITION_TIME_ML / 2;

  public static isHovered(columnSizerElement: HTMLElement) {
    return columnSizerElement.style.backgroundImage === ColumnSizerElements.HOVER_BACKGROUND_IMAGE;
  }

  public static setBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = ColumnSizerElements.BACKGROUND_IMAGE;
  }

  public static unsetBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = ColumnSizerElements.HOVER_BACKGROUND_IMAGE;
  }

  public static setTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = ColumnSizerElements.TRANSITION_TIME;
  }

  public static unsetTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = `0.0s`;
  }

  private static createElement(widthSizerIndex: number) {
    const columnSizerElement = document.createElement('div');
    columnSizerElement.id = `${ColumnSizerElements.COLUMN_WIDTH_SIZER_ID_PREFIX}${widthSizerIndex}`;
    columnSizerElement.classList.add(ColumnSizerElements.COLUMN_WIDTH_SIZER_CLASS);
    ColumnSizerElements.setDefaultProperties(columnSizerElement);
    ColumnSizerElements.setBackgroundImage(columnSizerElement);
    return columnSizerElement;
  }

  private static createNewColumnSizerState(columnSizerElement: HTMLElement) {
    return {element: columnSizerElement, isMouseHovered: false, isParentCellHovered: false};
  }

  // prettier-ignore
  public static createAndAddNew(etc: EditableTableComponent) {
    const { overlayElementsParentRef, overlayElementsState: { columnSizers } } = etc;
    const columnSizerElement = ColumnSizerElements.createElement(columnSizers.list.length);
    const columnSizerState = ColumnSizerElements.createNewColumnSizerState(columnSizerElement);
    columnSizerElement.onmouseenter = ColumnSizerEvents.sizerOnMouseEnter.bind(etc, columnSizerState);
    columnSizerElement.onmouseleave = ColumnSizerEvents.sizerOnMouseLeave.bind(etc, columnSizerState);
    (overlayElementsParentRef as HTMLElement).appendChild(columnSizerElement);
    columnSizers.list.push(columnSizerState);
  }

  public static display(columnSizerElement: HTMLElement, height: string, top: string, left: string) {
    columnSizerElement.style.height = height;
    columnSizerElement.style.top = top;
    columnSizerElement.style.left = left;
    columnSizerElement.style.display = 'block';
  }

  public static hide(columnSizerElement: HTMLElement) {
    columnSizerElement.style.display = 'none';
  }

  public static hideAfterBlurAnimation(columnSizerElement: HTMLElement) {
    setTimeout(() => {
      ColumnSizerElements.hide(columnSizerElement);
      // TO-DO - check if HALF_TRANSITION_TIME_ML or TRANSITION_TIME_ML timeout is the better one
    }, ColumnSizerElements.HALF_TRANSITION_TIME_ML);
  }

  public static setLeftProp(columnSizerElement: HTMLElement, colLeft: number, colWidth: number, newXMovement: number) {
    const newLeft = `${colLeft + colWidth + newXMovement}px`;
    columnSizerElement.style.left = newLeft;
  }

  // TO-DO this should only be set if there is no color for vertical borders
  // properties that are changed by hover
  public static setDefaultProperties(columnSizerElement: HTMLElement) {
    columnSizerElement.style.width = `1px`;
    columnSizerElement.style.marginLeft = `0px`;
    columnSizerElement.style.backgroundColor = ``;
  }

  // properties that are reset when columnSizer is no longer hovered
  public static setPropertiesAfterBlurAnimation(columnSizerElement: HTMLElement) {
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
  }
}
