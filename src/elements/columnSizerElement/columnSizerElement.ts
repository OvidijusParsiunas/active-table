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
  public static readonly COLUMN_SIZER_CLASS = 'column-sizer';
  private static readonly COLUMN_SIZER_ID_PREFIX = `${ColumnSizerElement.COLUMN_SIZER_CLASS}-`;
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
    ColumnSizerElement.setColors(columnSizerElement, `#ffffff08`);
    ColumnSizerElementOverlay.hide(columnSizerElement.children[0] as HTMLElement);
  }

  private static createElement(sizerIndex: number) {
    const columnSizerElement = document.createElement('div');
    columnSizerElement.id = `${ColumnSizerElement.COLUMN_SIZER_ID_PREFIX}${sizerIndex}`;
    columnSizerElement.classList.add(ColumnSizerElement.COLUMN_SIZER_CLASS);
    const middleOverlayElement = ColumnSizerElementOverlay.create();
    columnSizerElement.append(middleOverlayElement);
    ColumnSizerElement.hide(columnSizerElement);
    return columnSizerElement;
  }

  // prettier-ignore
  public static refreshSecondLastColumnSizer(
      columnSizerList: ColumnSizerList, columnsDetails: ColumnsDetails, tableElement: HTMLElement) {
    const secondLastColumnSizerIndex = columnSizerList.length - 2;
    const columnSizer = columnSizerList[secondLastColumnSizerIndex];
    if (columnSizer) {
      const newColumnSizer = ColumnSizerElement.createStateAndApplyToElement(
        columnSizer.element, columnsDetails, secondLastColumnSizerIndex, tableElement)
      // cannot simply overwright columnSizerList[previousColumnSizerIndex] as the entry is already binded to elements
      Object.assign(columnSizerList[secondLastColumnSizerIndex], newColumnSizer);
    }
  }

  private static applySizerStateToElement(columnSizerElement: HTMLElement, columnSizer: ColumnSizerState) {
    ColumnSizerElement.setDefaultProperties(columnSizerElement);
    ColumnSizerElement.setBackgroundImage(columnSizerElement, columnSizer.backgroundImage);
  }

  private static createNewColumnSizerState(columnSizerElement: HTMLElement, isOnCellBorder: boolean): ColumnSizerState {
    return {
      element: columnSizerElement,
      // WORK need to look at padding to set
      hoverWidth: '7px',
      isSizerHovered: false,
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
  public static create(etc: EditableTableComponent) {
    const { overlayElementsState: { columnSizers }, columnsDetails } = etc;
    const sizerIndex = columnSizers.list.length; 
    const columnSizerElement = ColumnSizerElement.createElement(sizerIndex);
    const columnSizer = ColumnSizerElement.createStateAndApplyToElement(
      columnSizerElement, columnsDetails, sizerIndex, etc.tableBodyElementRef as HTMLElement)
    // WORK - this may need to be reset on removal
    columnSizers.list.push(columnSizer);
    columnSizerElement.onmouseenter = ColumnSizerEvents.sizerOnMouseEnter.bind(etc, columnSizer);
    columnSizerElement.onmouseleave = ColumnSizerEvents.sizerOnMouseLeave.bind(etc, columnSizer);
    return columnSizerElement;
  }

  public static display(columnSizerElement: HTMLElement, height: string) {
    columnSizerElement.style.height = height;
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

  public static setHoverProperties(columnSizerElement: HTMLElement, width: string) {
    ColumnSizerElementOverlay.display(columnSizerElement.children[0] as HTMLElement);
    ColumnSizerElement.setTransitionTime(columnSizerElement);
    ColumnSizerElement.setColors(columnSizerElement, ColumnSizerElement.HOVER_COLOR);
    columnSizerElement.style.width = width;
  }
}
