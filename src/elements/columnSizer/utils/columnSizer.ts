import {EditableTableComponent} from '../../../editable-table-component';
import {BorderWidths, ColumnSizerElement} from '../columnSizerElement';
import {MovableColumnSizerElement} from '../movableColumnSizerElement';
import {ColumnSizerOverlayElement} from '../columnSizerOverlayElement';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {ColumnSizerT} from '../../../types/columnSizer';
import {Optional} from '../../../types/optional';
import {PX} from '../../../types/dimensions';

export class ColumnSizer {
  public static shouldWidthBeIncreased(widthPx: number) {
    return widthPx > 4;
  }

  // prettier-ignore
  private static getBackgroundImage(totalCellBorderWidth: number,
      leftCellLeft: number, beforeLeftCellRight: number, isLastCell: boolean, tableElement?: HTMLElement) {
    // REF-1
    // for last column sizer
    // the strategy is to have a filled column sizer background image if the table has no border or even if it does
    // and the cells do not as they will too have filled backgrounds, hence this will maintain the consistency
    // empty background image if both cells and table have borders
    // for first to second last column sizer
    // filled background if no border and empty if present
    if (isLastCell && tableElement) {
      if (Number.parseInt(tableElement.style.borderRightWidth) > 0
          && (leftCellLeft > 0 || beforeLeftCellRight > 0)) {
        return ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
      }
    } else if (totalCellBorderWidth > 0) {
      return ColumnSizerElement.EMPTY_BACKGROUND_IMAGE;
    }
    return ColumnSizerElement.FILLED_BACKGROUND_IMAGE;
  }

  private static getMarginRight(borderWidths: BorderWidths, isLastCell: boolean): PX {
    if (isLastCell || !borderWidths) return '0px';
    return `${borderWidths.leftCellRight - borderWidths.rightCellLeft}px`;
  }

  private static getTotalCellBorderWidth(borderWidths: BorderWidths) {
    return borderWidths ? borderWidths.rightCellLeft + borderWidths.leftCellRight : 0;
  }

  private static generateBorderWidthsInfo(columnsDetails: ColumnsDetailsT, sizerIndex: number): BorderWidths {
    const borderWidths: BorderWidths = {rightCellLeft: 0, leftCellLeft: 0, leftCellRight: 0, beforeLeftCellRight: 0};
    const beforeLeftCell = columnsDetails[sizerIndex - 1]?.elements[0];
    if (beforeLeftCell) borderWidths.beforeLeftCellRight = Number.parseInt(beforeLeftCell.style.borderRightWidth) || 0;
    const leftCell = columnsDetails[sizerIndex]?.elements[0];
    if (leftCell) {
      borderWidths.leftCellLeft = Number.parseInt(leftCell.style.borderLeftWidth) || 0;
      borderWidths.leftCellRight = Number.parseInt(leftCell.style.borderRightWidth) || 0;
    }
    const rightCell = columnsDetails[sizerIndex + 1]?.elements[0];
    if (rightCell) borderWidths.rightCellLeft = Number.parseInt(rightCell.style.borderLeftWidth) || 0;
    return borderWidths;
  }

  // prettier-ignore
  public static createObject(columnSizerElement: HTMLElement, columnsDetails: ColumnsDetailsT, sizerIndex: number,
      overlayElement?: HTMLElement, movableColumnSizer?: HTMLElement, tableElement?: HTMLElement): ColumnSizerT {
    const borderWidthsInfo = ColumnSizer.generateBorderWidthsInfo(columnsDetails, sizerIndex);
    const totalCellBorderWidth = ColumnSizer.getTotalCellBorderWidth(borderWidthsInfo);
    const isLastCell = columnsDetails.length - 1 === sizerIndex;
    const marginRight = ColumnSizer.getMarginRight(borderWidthsInfo, isLastCell);
    const backgroundImage = ColumnSizer.getBackgroundImage(totalCellBorderWidth,
      borderWidthsInfo.leftCellLeft, borderWidthsInfo.beforeLeftCellRight, isLastCell, tableElement);
    // movableElement should be treated as always present in columnSizer, but InsertRemoveColumnSizer needs to create
    // a new object to overwrite its other properties
    const columnSizerState: Optional<ColumnSizerT, 'movableElement' | 'overlayElement'> = {
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
    if (overlayElement) columnSizerState.overlayElement = overlayElement;
    return columnSizerState as ColumnSizerT;
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, sizerIndex: number) {
    const { columnsDetails, tableElementRef, columnResizerStyle: userSetColumnSizerStyle } = etc;
    const columnSizerElement = ColumnSizerElement.create(sizerIndex, userSetColumnSizerStyle);
    const movableColumnSizer = MovableColumnSizerElement.create(userSetColumnSizerStyle);
    const overlayElement = ColumnSizerOverlayElement.create();
    const columnSizer = ColumnSizer.createObject(columnSizerElement, columnsDetails, sizerIndex,
      overlayElement, movableColumnSizer, tableElementRef as HTMLElement);
    ColumnSizerOverlayElement.applyEvents(etc, columnSizer);
    return columnSizer;
  }
}
