import {BorderWidths, ColumnSizerElement} from '../../elements/columnSizer/columnSizerElement';
import {MovableColumnSizerElement} from '../../elements/columnSizer/movableColumnSizerElement';
import {ColumnSizerEvents} from '../../elements/columnSizer/columnSizerEvents';
import {EditableTableComponent} from '../../editable-table-component';
import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerT} from '../../types/columnSizer';
import {Optional} from '../../types/optional';
import {PX} from '../../types/pxDimension';

// WORK - place this back into the elements section
export class ColumnSizer {
  public static shouldWidthBeIncreased(widthPx: number) {
    return widthPx > 4;
  }

  // prettier-ignore
  private static getBackgroundImage(
      totalCellBorderWidth: number, beforeLeftCellRight: number, isLastCell: boolean, tableElement?: HTMLElement) {
    // REF-1
    // because right border is not placed on the rightmost cell and is instead controlled by the table border
    // the strategy here is to have a filled column sizer background image if the table has no border or even if it does
    // and the cells do not as they will too have filled borders and hence this will maintain consistency
    // empty sizer background image if both cells and table have a border
    if (isLastCell && tableElement) {
      if (Number.parseInt(tableElement.style.borderRightWidth) > 0
          && (totalCellBorderWidth > 0 || beforeLeftCellRight > 0)) {
        return ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
      }
    } else if (totalCellBorderWidth > 0) {
      return ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
    }
    return ColumnSizerElement.FILLED_BACKGROUND_IMAGE;
  }

  private static getMarginRight(borderWidths: BorderWidths): PX {
    const marginRight = borderWidths ? borderWidths.leftCellRight - borderWidths.rightCellLeft : 0;
    return `${marginRight}px`;
  }

  private static getTotalCellBorderWidth(borderWidths: BorderWidths) {
    return borderWidths ? borderWidths.rightCellLeft + borderWidths.leftCellRight : 0;
  }

  private static generateBorderWidthsInfo(columnsDetails: ColumnsDetailsT, sizerIndex: number): BorderWidths {
    const borderWidths: BorderWidths = {rightCellLeft: 0, leftCellRight: 0, beforeLeftCellRight: 0};
    const beforeLeftCell = columnsDetails[sizerIndex - 1]?.elements[0];
    if (beforeLeftCell) borderWidths.beforeLeftCellRight = Number.parseInt(beforeLeftCell.style.borderRightWidth) || 0;
    const leftCell = columnsDetails[sizerIndex]?.elements[0];
    if (leftCell) borderWidths.leftCellRight = Number.parseInt(leftCell.style.borderRightWidth) || 0;
    const rightCell = columnsDetails[sizerIndex + 1]?.elements[0];
    if (rightCell) borderWidths.rightCellLeft = Number.parseInt(rightCell.style.borderLeftWidth) || 0;
    return borderWidths;
  }

  // prettier-ignore
  public static createObject(columnSizerElement: HTMLElement, columnsDetails: ColumnsDetailsT,
      sizerIndex: number, movableColumnSizer?: HTMLElement, tableElement?: HTMLElement): ColumnSizerT {
    const borderWidthsInfo = ColumnSizer.generateBorderWidthsInfo(columnsDetails, sizerIndex);
    const totalCellBorderWidth = ColumnSizer.getTotalCellBorderWidth(borderWidthsInfo);
    const marginRight = ColumnSizer.getMarginRight(borderWidthsInfo);
    const backgroundImage = ColumnSizer.getBackgroundImage(totalCellBorderWidth,
      borderWidthsInfo.beforeLeftCellRight, columnsDetails.length - 1 === sizerIndex, tableElement);
    // movableElement should be treated as always present in columnSizer, but InsertRemoveColumnSizer needs to create
    // a new object to overwrite its other properties
    const columnSizerState: Optional<ColumnSizerT, 'movableElement'> = {
      element: columnSizerElement,
      styles: {
        default: {
          width: ColumnSizer.shouldWidthBeIncreased(totalCellBorderWidth) ? `${totalCellBorderWidth}px` : '0.1px',
          backgroundImage,
        },
        hover: {
          width: ColumnSizer.shouldWidthBeIncreased(totalCellBorderWidth) ? `${totalCellBorderWidth * 1.5}px` : '7px',
        },
        static: {
          marginRight,
        }
      },
      isSideCellHovered: false,
      isSizerHovered: false,
      isMouseUpOnSizer: false,
    };
    if (movableColumnSizer) columnSizerState.movableElement = movableColumnSizer;
    return columnSizerState as ColumnSizerT;
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, sizerIndex: number) {
    const { columnsDetails, tableElementRef, columnResizerStyle: userSetColumnSizerStyle } = etc;
    const columnSizerElement = ColumnSizerElement.create(sizerIndex, userSetColumnSizerStyle);
    const movableColumnSizer = MovableColumnSizerElement.create(userSetColumnSizerStyle);
    const columnSizer = ColumnSizer.createObject(columnSizerElement, columnsDetails, sizerIndex,
      movableColumnSizer, tableElementRef as HTMLElement);
    columnSizerElement.onmousedown = ColumnSizerEvents.sizerOnMouseDown.bind(etc);
    columnSizerElement.onmouseenter = ColumnSizerEvents.sizerOnMouseEnter.bind(etc, columnSizer);
    columnSizerElement.onmouseleave = ColumnSizerEvents.sizerOnMouseLeave.bind(etc, columnSizer);
    return columnSizer;
  }
}
