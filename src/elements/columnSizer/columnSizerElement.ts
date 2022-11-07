import {UpdateRowElement} from '../../utils/insertRemoveStructure/update/updateRowElement';
import {ColumnSizerT, UserSetColumnSizerStyle} from '../../types/columnSizer';
import {ColumnSizerFillerElement} from './columnSizerFillerElement';
import {SEMI_TRANSPARENT_COLOR} from '../../consts/colors';
import {PX} from '../../types/pxDimension';

export interface BorderWidths {
  leftCellRight: number;
  rightCellLeft: number;
  leftCellLeft: number;
  // the reason why this is needed is the last cell cannot see if left cell has border right as it is overriden
  // hence we can find out if it is supposed to have cell right by looking at the cell before the left one
  beforeLeftCellRight: number;
}

// REF-12
// the reason why there is a unique column sizer for each column is because sometimes the user may hover over
// it before hovering over a cell which makes state management difficult - e.g from top/below
// another reason is because the column sizer neeeds to know which column it is manipulating and needs to
// be binded to the header cell
export class ColumnSizerElement {
  public static readonly FILLED_BACKGROUND_IMAGE =
    'linear-gradient(180deg, #cdcdcd, #cdcdcd 75%, transparent 75%, transparent 100%)';
  public static readonly EMPTY_BACKGROUND_IMAGE = 'none';
  // this is not part of the ColumnSizerStyles object as it remains consistent for all sizers after setting it once
  public static HOVER_COLOR = 'grey';
  private static readonly COLUMN_SIZER_CLASS = 'column-sizer';
  private static readonly COLUMN_SIZER_ID_PREFIX = `${ColumnSizerElement.COLUMN_SIZER_CLASS}-`;
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

  // is not used to unset background image
  public static unsetElementsToDefault(columnSizerElement: HTMLElement, width: PX, setColors = true) {
    if (setColors) ColumnSizerElement.setColors(columnSizerElement, SEMI_TRANSPARENT_COLOR);
    ColumnSizerFillerElement.hide(columnSizerElement.children[0] as HTMLElement);
    columnSizerElement.style.width = width;
  }

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(columnSizerElement: HTMLElement, marginRight: string) {
    columnSizerElement.style.marginRight = marginRight;
  }

  public static setElementId(columnSizerElement: HTMLElement, sizerIndex: number) {
    columnSizerElement.id = `${ColumnSizerElement.COLUMN_SIZER_ID_PREFIX}${sizerIndex}`;
  }

  private static setHoverColorProperty(userSetColumnSizerStyle: UserSetColumnSizerStyle) {
    const backgroundColor = userSetColumnSizerStyle?.hover?.backgroundColor;
    if (backgroundColor) ColumnSizerElement.HOVER_COLOR = backgroundColor;
  }

  public static create(sizerIndex: number, userSetColumnSizerStyle: UserSetColumnSizerStyle) {
    const columnSizerElement = document.createElement('div');
    ColumnSizerElement.setElementId(columnSizerElement, sizerIndex);
    ColumnSizerElement.setHoverColorProperty(userSetColumnSizerStyle);
    columnSizerElement.classList.add(ColumnSizerElement.COLUMN_SIZER_CLASS);
    const fillerElement = ColumnSizerFillerElement.create();
    columnSizerElement.append(fillerElement);
    ColumnSizerElement.hide(columnSizerElement);
    return columnSizerElement;
  }

  public static display(columnSizerElement: HTMLElement) {
    // originally executed this when a new column was added/removed etc, but there were too many cases
    // where the height of the column was augmented, hence setting it here for ease of maintenance
    UpdateRowElement.updateHeaderRowHeight(columnSizerElement.parentElement?.parentElement as HTMLElement);
    columnSizerElement.style.display = 'flex';
  }

  private static hide(columnSizerElement: HTMLElement) {
    columnSizerElement.style.display = 'none';
  }

  private static hideWithBlurAnimation(columnSizerElement: HTMLElement) {
    setTimeout(() => {
      ColumnSizerElement.hide(columnSizerElement);
    }, ColumnSizerElement.HALF_TRANSITION_TIME_ML);
  }

  public static hideWhenCellNotHovered(columnSizer: ColumnSizerT, wasHovered: boolean) {
    // do not hide if the other side cell is hovered
    if (columnSizer.isSideCellHovered) return;
    if (wasHovered) {
      ColumnSizerElement.hideWithBlurAnimation(columnSizer.element);
    } else {
      ColumnSizerElement.hide(columnSizer.element);
    }
  }

  public static setColors(columnSizerElement: HTMLElement, color: string) {
    columnSizerElement.style.backgroundColor = color;
    columnSizerElement.style.borderLeftColor = color;
    columnSizerElement.style.borderRightColor = color;
  }

  public static setHoverStyle(columnSizerElement: HTMLElement, width: PX, setTransition: boolean, anotherColor?: string) {
    ColumnSizerFillerElement.display(columnSizerElement.children[0] as HTMLElement);
    if (setTransition) ColumnSizerElement.setTransitionTime(columnSizerElement);
    ColumnSizerElement.setColors(columnSizerElement, anotherColor || ColumnSizerElement.HOVER_COLOR);
    columnSizerElement.style.width = width;
  }
}
