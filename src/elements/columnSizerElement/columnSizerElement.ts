import {ColumnSizerList, ColumnSizerStateT} from '../../types/overlayElements';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnSizerElementOverlay} from './columnSizerElementOverlay';
import {ColumnsDetails} from '../../types/columnDetails';
import {ColumnSizerEvents} from './columnSizerEvents';
import {ColumnSizerState} from './columnSizerState';

export interface BorderWidths {
  leftCellRight: number;
  rightCellLeft: number;
  // the reason why this is needed is the last cell cannot see if left cell has border right as it is overriden
  // hence we can find out if it is supposed to have cell right by looking at the cell before the left one
  beforeLeftCellRight: number;
}

// the reason why there are multiple column sizers is because sometimes the user may hover over it before hovering
// over a cell e.g from top/below
export class ColumnSizerElement {
  public static readonly FILLED_BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  public static readonly EMPTY_BACKGROUND_IMAGE = 'none';
  public static readonly HOVER_COLOR = 'grey';
  public static readonly COLUMN_SIZER_CLASS = 'column-sizer';
  private static readonly COLUMN_SIZER_ID_PREFIX = `${ColumnSizerElement.COLUMN_SIZER_CLASS}-`;
  private static readonly TRANSITION_TIME_ML = 200;
  private static readonly TRANSITION_TIME = `${ColumnSizerElement.TRANSITION_TIME_ML / 1000}s`;
  private static readonly HALF_TRANSITION_TIME_ML = ColumnSizerElement.TRANSITION_TIME_ML / 2;

  public static isHovered(columnSizerElement: HTMLElement) {
    return columnSizerElement.style.backgroundImage === ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
  }

  public static setBackgroundImage(columnSizerElement: HTMLElement, backgroundImage: string) {
    columnSizerElement.style.backgroundImage = backgroundImage;
  }

  public static unsetBackgroundImage(columnSizerElement: HTMLElement) {
    columnSizerElement.style.backgroundImage = ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
  }

  public static setTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = ColumnSizerElement.TRANSITION_TIME;
  }

  public static unsetTransitionTime(columnSizerElement: HTMLElement) {
    columnSizerElement.style.transition = '0.0s';
  }

  public static setDefaultProperties(columnSizerElement: HTMLElement, width: string) {
    columnSizerElement.style.width = width;
    ColumnSizerElement.setColors(columnSizerElement, '#ffffff08');
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
  public static refreshSecondLastColumnSizer(columnSizerList: ColumnSizerList, columnsDetails: ColumnsDetails) {
    const secondLastColumnSizerIndex = columnSizerList.length - 2;
    const columnSizer = columnSizerList[secondLastColumnSizerIndex];
    if (columnSizer) {
      const newColumnSizer = ColumnSizerElement.createStateAndApplyToElement(
        columnSizer.element, columnsDetails, secondLastColumnSizerIndex);
      // cannot simply overwright columnSizerList[previousColumnSizerIndex] as the entry is already binded to elements
      Object.assign(columnSizerList[secondLastColumnSizerIndex], newColumnSizer);
    }
  }

  private static applySizerStateToElement(columnSizerElement: HTMLElement, columnSizer: ColumnSizerStateT) {
    ColumnSizerElement.setDefaultProperties(columnSizerElement, columnSizer.styles.default.width);
    ColumnSizerElementOverlay.setWidth(columnSizer.element.children[0] as HTMLElement, columnSizer.styles.default.width);
    columnSizerElement.style.marginLeft = columnSizer.styles.permanent.marginLeft;
    ColumnSizerElement.setBackgroundImage(columnSizerElement, columnSizer.styles.default.backgroundImage);
  }

  // prettier-ignore
  private static createStateAndApplyToElement(columnSizerElement: HTMLElement,
      columnsDetails: ColumnsDetails, sizerIndex: number, tableElement?: HTMLElement) {
    const columnSizer = ColumnSizerState.create(columnSizerElement, columnsDetails, sizerIndex, tableElement);
    ColumnSizerElement.applySizerStateToElement(columnSizerElement, columnSizer);
    return columnSizer;
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent) {
    const { overlayElementsState: { columnSizers }, columnsDetails, tableElementRef } = etc;
    const sizerIndex = columnSizers.list.length;
    const columnSizerElement = ColumnSizerElement.createElement(sizerIndex);
    const columnSizer = ColumnSizerElement.createStateAndApplyToElement(
      columnSizerElement, columnsDetails, sizerIndex, tableElementRef as HTMLElement);
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
