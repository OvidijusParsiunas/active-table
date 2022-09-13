import {ColumnSizerList, ColumnSizerState} from '../../types/overlayElements';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElementOverlay} from './columnSizerElementOverlay';
import {ColumnsDetails} from '../../types/columnDetails';
import {ColumnSizerEvents} from './columnSizerEvents';

// the reason why there are multiple column sizers is because sometimes the user may hover over it before hovering
// over a cell e.g from top/below
export class ColumnSizerElement {
  private static readonly DEFAULT_BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  private static readonly HOVER_BACKGROUND_IMAGE = 'none';
  public static readonly HOVER_COLOR = 'grey';
  public static readonly COLUMN_WIDTH_SIZER_CLASS = 'column-width-sizer';
  private static readonly COLUMN_WIDTH_SIZER_ID_PREFIX = 'width-sizer-';
  private static readonly TRANSITION_TIME_ML = 200;
  private static readonly TRANSITION_TIME = `${ColumnSizerElement.TRANSITION_TIME_ML / 1000}s`;
  private static readonly HALF_TRANSITION_TIME_ML = ColumnSizerElement.TRANSITION_TIME_ML / 2;

  public static isHovered(columnSizerElement: HTMLElement) {
    return columnSizerElement.style.backgroundImage === ColumnSizerElement.HOVER_BACKGROUND_IMAGE;
  }

  public static setBackgroundImage(columnSizerElement: HTMLElement, backgroundImage: string) {
    columnSizerElement.style.backgroundImage = backgroundImage;
  }

  public static unsetBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = ColumnSizerElement.HOVER_BACKGROUND_IMAGE;
  }

  public static setTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = ColumnSizerElement.TRANSITION_TIME;
  }

  public static unsetTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = `0.0s`;
  }

  public static setDefaultProperties(columnSizerElement: HTMLElement) {
    // WORK - inherit width
    columnSizerElement.style.width = `0.1px`;
    columnSizerElement.style.marginLeft = `0px`;
    ColumnSizerElement.setColors(columnSizerElement, `#ffffff08`);
    ColumnSizerElementOverlay.hide(columnSizerElement.children[0] as HTMLElement);
  }

  private static createElement(sizerIndex: number) {
    const columnSizerElement = document.createElement('div');
    columnSizerElement.id = `${ColumnSizerElement.COLUMN_WIDTH_SIZER_ID_PREFIX}${sizerIndex}`;
    columnSizerElement.classList.add(ColumnSizerElement.COLUMN_WIDTH_SIZER_CLASS);
    const middleOverlayElement = ColumnSizerElementOverlay.create();
    columnSizerElement.appendChild(middleOverlayElement);
    return columnSizerElement;
  }

  // prettier-ignore
  private static refreshPreviousColumnSizerBackground(
      columnSizerList: ColumnSizerList, columnsDetails: ColumnsDetails, tableElement: HTMLElement) {
    const previousSizerIndex = columnSizerList.length - 2;
    const previousSizer = columnSizerList[previousSizerIndex];
    if (previousSizer) {
      const columnSizer = ColumnSizerElement.createStateAndApplyToElement(
        previousSizer.element, columnsDetails, previousSizerIndex, tableElement)
      // cannot simply overwright columnSizerList[previousSizerIndex] as it the entry is already binded to elements
      Object.assign(columnSizerList[previousSizerIndex], columnSizer);
    }
  }

  private static applySizerStateToElement(columnSizerElement: HTMLElement, columnSizer: ColumnSizerState) {
    ColumnSizerElement.setDefaultProperties(columnSizerElement);
    ColumnSizerElement.setBackgroundImage(columnSizerElement, columnSizer.backgroundImage);
  }

  private static createNewColumnSizerState(columnSizerElement: HTMLElement, isOnCellBorder: boolean): ColumnSizerState {
    return {
      element: columnSizerElement,
      isMouseHovered: false,
      isParentCellHovered: false,
      backgroundImage: isOnCellBorder ? '' : ColumnSizerElement.DEFAULT_BACKGROUND_IMAGE,
    };
  }

  private static isOnCellBorder(columnsDetails: ColumnsDetails, sizerIndex: number, tableElement?: HTMLElement) {
    const isOnCellBorder = !!(
      columnsDetails[sizerIndex].elements[0].style.borderRight ||
      columnsDetails[sizerIndex + 1]?.elements[0].style.borderLeft
    );
    // REF-1
    // cell border is not placed on the rightmost border and is controlled by the table border
    // the strategy here is to indicate a border if the table has a right border and other cells have borders
    // but do not indicate it if either does not
    // this will cause the predefined color to appear when table has a border but cells do not, but will retain consistency
    if (columnsDetails.length - 1 === sizerIndex && tableElement) {
      return !!tableElement.style.borderRight && isOnCellBorder;
    }
    return isOnCellBorder;
  }

  // prettier-ignore
  private static createStateAndApplyToElement(
      columnSizerElement: HTMLElement, columnsDetails: ColumnsDetails, sizerIndex: number, tableElement: HTMLElement) {
    const isOnCellBorder = ColumnSizerElement.isOnCellBorder(columnsDetails, sizerIndex, tableElement);
    const columnSizer = ColumnSizerElement.createNewColumnSizerState(columnSizerElement, isOnCellBorder);
    ColumnSizerElement.applySizerStateToElement(columnSizerElement, columnSizer);
    return columnSizer;
  }

  // prettier-ignore
  public static createAndAddNew(etc: EditableTableComponent) {
    const { overlayElementsParentRef, overlayElementsState: { columnSizers }, columnsDetails } = etc;
    const sizerIndex = columnSizers.list.length; 
    const columnSizerElement = ColumnSizerElement.createElement(sizerIndex);
    const columnSizer = ColumnSizerElement.createStateAndApplyToElement(
      columnSizerElement, columnsDetails, sizerIndex, etc.tableBodyElementRef as HTMLElement)
    columnSizerElement.onmouseenter = ColumnSizerEvents.sizerOnMouseEnter.bind(etc, columnSizer);
    columnSizerElement.onmouseleave = ColumnSizerEvents.sizerOnMouseLeave.bind(etc, columnSizer);
    (overlayElementsParentRef as HTMLElement).appendChild(columnSizerElement);
    // WORK - this may need to be reset on removal
    columnSizers.list.push(columnSizer);
    // WORK - need this on delete
    // this is used to reset the state as upon adding a new header cell, the previous cell border no longer
    // depends on the table
    ColumnSizerElement.refreshPreviousColumnSizerBackground(
      columnSizers.list, columnsDetails, etc.tableBodyElementRef as HTMLElement);
  }

  public static display(columnSizerElement: HTMLElement, height: string, top: string, left: string) {
    columnSizerElement.style.height = height;
    columnSizerElement.style.top = top;
    columnSizerElement.style.left = left;
    columnSizerElement.style.display = 'flex';
  }

  public static hide(columnSizerElement: HTMLElement) {
    columnSizerElement.style.display = 'none';
  }

  public static hideAfterBlurAnimation(columnSizerElement: HTMLElement) {
    setTimeout(() => {
      ColumnSizerElement.hide(columnSizerElement);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  public static setLeftProp(columnSizerElement: HTMLElement, colLeft: number, colWidth: number, newXMovement: number) {
    const newLeft = `${colLeft + colWidth + newXMovement}px`;
    columnSizerElement.style.left = newLeft;
  }

  private static setColors(columnSizerElement: HTMLElement, color: string) {
    columnSizerElement.style.backgroundColor = color;
    columnSizerElement.style.borderLeftColor = color;
    columnSizerElement.style.borderRightColor = color;
  }

  // properties that are reset when columnSizer is no longer hovered
  public static setPropertiesAfterBlurAnimation(columnSizerElement: HTMLElement, backgroundImage: string) {
    setTimeout(() => {
      ColumnSizerElement.setBackgroundImage(columnSizerElement, backgroundImage);
      setTimeout(() => {
        ColumnSizerElement.unsetTransitionTime(columnSizerElement);
      }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  public static setHoverProperties(columnSizerElement: HTMLElement) {
    ColumnSizerElementOverlay.display(columnSizerElement.children[0] as HTMLElement);
    ColumnSizerElement.setTransitionTime(columnSizerElement);
    ColumnSizerElement.setColors(columnSizerElement, ColumnSizerElement.HOVER_COLOR);
    columnSizerElement.style.width = `7px`;
    columnSizerElement.style.marginLeft = `-4px`;
  }
}
