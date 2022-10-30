import {ColumnSizerElementOverlay} from './columnSizerElementOverlay';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {PX} from '../../types/pxDimension';

// WORK - hovering over the sizer some times does not really display it at the correct area
// README - explain anatomy of a column sizer
export interface BorderWidths {
  leftCellRight: number;
  rightCellLeft: number;
  // the reason why this is needed is the last cell cannot see if left cell has border right as it is overriden
  // hence we can find out if it is supposed to have cell right by looking at the cell before the left one
  beforeLeftCellRight: number;
}

// the reason why there is a unique column sizer for each column is because sometimes the user may hover over
// it before hovering over a cell which makes state management difficult - e.g from top/below
// another reason is because the column sizer neeeds to know which column it is manipulating and needs to
// be binded to the header cell
export class ColumnSizerElement {
  public static readonly FILLED_BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  public static readonly EMPTY_BACKGROUND_IMAGE = 'none';
  public static readonly DEFAULT_COLOR = 'grey';
  public static readonly COLUMN_SIZER_CLASS = 'column-sizer';
  public static readonly COLUMN_SIZER_ID_PREFIX = `${ColumnSizerElement.COLUMN_SIZER_CLASS}-`;
  public static readonly TRANSITION_TIME_ML = 200;
  private static readonly TRANSITION_TIME = `${ColumnSizerElement.TRANSITION_TIME_ML / 1000}s`;
  public static readonly HALF_TRANSITION_TIME_ML = ColumnSizerElement.TRANSITION_TIME_ML / 2;

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

  // does not unset the background image
  public static unsetElementsToDefault(columnSizerElement: HTMLElement, width: PX, setColors = true) {
    if (setColors) ColumnSizerElement.setColors(columnSizerElement, SEMI_TRANSPARENT_COLOR);
    ColumnSizerElementOverlay.hide(columnSizerElement.children[0] as HTMLElement);
    columnSizerElement.style.width = width;
  }

  public static setPermanentProperties(columnSizerElement: HTMLElement, marginLeft: string) {
    columnSizerElement.style.marginLeft = marginLeft;
  }

  public static setElementId(columnSizerElement: HTMLElement, sizerIndex: number) {
    columnSizerElement.id = `${ColumnSizerElement.COLUMN_SIZER_ID_PREFIX}${sizerIndex}`;
  }

  public static create(sizerIndex: number, customHoverColor?: string) {
    const columnSizerElement = document.createElement('div');
    ColumnSizerElement.setElementId(columnSizerElement, sizerIndex);
    columnSizerElement.classList.add(ColumnSizerElement.COLUMN_SIZER_CLASS);
    const middleOverlayElement = ColumnSizerElementOverlay.create(customHoverColor);
    columnSizerElement.append(middleOverlayElement);
    ColumnSizerElement.hide(columnSizerElement);
    return columnSizerElement;
  }

  public static display(columnSizerElement: HTMLElement, height: PX) {
    columnSizerElement.style.height = height;
    columnSizerElement.style.display = 'flex';
  }

  public static hide(columnSizerElement: HTMLElement) {
    columnSizerElement.style.display = 'none';
  }

  public static setColors(columnSizerElement: HTMLElement, color: string) {
    columnSizerElement.style.backgroundColor = color;
    columnSizerElement.style.borderLeftColor = color;
    columnSizerElement.style.borderRightColor = color;
  }

  public static setHoverStyle(columnSizerElement: HTMLElement, width: PX, color: string, setTransition: boolean) {
    ColumnSizerElementOverlay.display(columnSizerElement.children[0] as HTMLElement);
    if (setTransition) ColumnSizerElement.setTransitionTime(columnSizerElement);
    ColumnSizerElement.setColors(columnSizerElement, color);
    columnSizerElement.style.width = width;
  }
}
