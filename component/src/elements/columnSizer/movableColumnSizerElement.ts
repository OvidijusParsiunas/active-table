import {ColumnSizerT, ColumnResizerColors} from '../../types/columnSizer';
import {PX} from '../../types/dimensions';

// REF-12
export class MovableColumnSizerElement {
  public static readonly DEFAULT_BACKGROUND_COLOR = '#4668ed';
  private static readonly MOVABLE_SIZER_CLASS = 'movable-column-sizer';
  private static readonly VERTICAL_LINE_CLASS = 'movable-column-sizer-vertical-line';

  // this is recalculated as it depends on the column index that the sizer is on
  public static setStaticProperties(movableSizerElement: HTMLElement, marginRight: string, width: PX) {
    movableSizerElement.style.marginRight = marginRight;
    movableSizerElement.style.width = width;
  }

  // the vertical line has no pointer events, hence it should not be expected to be passed in here
  public static isMovableColumnSizer(element: HTMLElement) {
    return element.classList.contains(MovableColumnSizerElement.MOVABLE_SIZER_CLASS);
  }

  private static getVerticalLineHeight(tableElement: HTMLElement, addRowCellPresent: boolean) {
    let height = tableElement.offsetHeight;
    if (addRowCellPresent) {
      const addRowCellHeight = (tableElement.lastChild as HTMLElement).offsetHeight;
      height -= addRowCellHeight;
    }
    return height;
  }

  public static display(tableElement: HTMLElement, columnSizer: ColumnSizerT, addRowCellPresent: boolean) {
    const movableSizer = columnSizer.movableElement;
    movableSizer.style.display = 'flex';
    const verticalLine = movableSizer.children[0] as HTMLElement;
    verticalLine.style.height = `${MovableColumnSizerElement.getVerticalLineHeight(tableElement, addRowCellPresent)}px`;
  }

  public static hide(movableSizer: HTMLElement) {
    movableSizer.style.display = 'none';
    movableSizer.style.left = '';
  }

  private static createVerticalLine(backgroundColor: string) {
    const verticalLine = document.createElement('div');
    verticalLine.style.backgroundColor = backgroundColor;
    verticalLine.classList.add(MovableColumnSizerElement.VERTICAL_LINE_CLASS);
    return verticalLine;
  }

  private static getMovableBackgroundColor(columnResizerColors: ColumnResizerColors) {
    return columnResizerColors.click || columnResizerColors.hover || MovableColumnSizerElement.DEFAULT_BACKGROUND_COLOR;
  }

  public static create(columnResizerColors: ColumnResizerColors) {
    const backgroundColor = MovableColumnSizerElement.getMovableBackgroundColor(columnResizerColors) as string;
    const movableSizer = document.createElement('div');
    movableSizer.style.backgroundColor = backgroundColor;
    movableSizer.classList.add(MovableColumnSizerElement.MOVABLE_SIZER_CLASS);
    MovableColumnSizerElement.hide(movableSizer);
    const verticalLine = MovableColumnSizerElement.createVerticalLine(backgroundColor);
    movableSizer.appendChild(verticalLine);
    return movableSizer;
  }
}
