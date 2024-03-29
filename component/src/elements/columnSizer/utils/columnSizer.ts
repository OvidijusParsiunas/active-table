import {ColumnResizerColors, ColumnSizerT} from '../../../types/columnSizer';
import {BorderWidths, ColumnSizerElement} from '../columnSizerElement';
import {MovableColumnSizerElement} from '../movableColumnSizerElement';
import {ColumnSizerOverlayElement} from '../columnSizerOverlayElement';
import {ColumnsDetailsT} from '../../../types/columnDetails';
import {Optional} from '../../../types/utilityTypes';
import {ActiveTable} from '../../../activeTable';
import {PX} from '../../../types/dimensions';

export class ColumnSizer {
  public static shouldWidthBeIncreased(widthPx: number) {
    return widthPx > 4;
  }

  // prettier-ignore
  private static getBackgroundImage(totalCellBorderWidth: number,
      leftCellLeft: number, beforeLeftCellRight: number | undefined, isLastCell: boolean, tableElement?: HTMLElement) {
    // REF-1
    // for last column sizer:
    // the strategy is to have a filled column sizer background image if the table has no border or even if it does
    // and the cells do not as they will too have filled backgrounds, hence this will maintain the consistency
    // empty background image if both cells and table have borders
    // for first to second last column sizer:
    // filled background if no border and empty if present
    if (isLastCell && tableElement) {
      if (Number.parseInt(getComputedStyle(tableElement).borderRightWidth) > 0
          && (leftCellLeft > 0 || (beforeLeftCellRight === undefined || beforeLeftCellRight > 0))) {
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
    // prettier-ignore
    const borderWidths: BorderWidths = {
      rightCellLeft: 0, leftCellLeft: 0, leftCellRight: 0, beforeLeftCellRight: undefined};
    const beforeLeftCell = columnsDetails[sizerIndex - 1]?.elements[0];
    if (beforeLeftCell) {
      borderWidths.beforeLeftCellRight = Number.parseInt(getComputedStyle(beforeLeftCell).borderRightWidth) || 0;
    }
    const leftCell = columnsDetails[sizerIndex]?.elements[0];
    if (leftCell) {
      const leftCellStyle = getComputedStyle(leftCell);
      borderWidths.leftCellLeft = Number.parseInt(leftCellStyle.borderLeftWidth) || 0;
      borderWidths.leftCellRight = Number.parseInt(leftCellStyle.borderRightWidth) || 0;
    }
    const rightCell = columnsDetails[sizerIndex + 1]?.elements[0];
    if (rightCell) borderWidths.rightCellLeft = Number.parseInt(getComputedStyle(rightCell).borderLeftWidth) || 0;
    return borderWidths;
  }

  // prettier-ignore
  public static createObject(columnSizerElement: HTMLElement, columnsDetails: ColumnsDetailsT, sizerIndex: number,
      tableElement: HTMLElement, overlayElement?: HTMLElement, movableColumnSizer?: HTMLElement,
      columnResizerColors?: ColumnResizerColors): ColumnSizerT {
    const borderWidthsInfo = ColumnSizer.generateBorderWidthsInfo(columnsDetails, sizerIndex);
    const totalCellBorderWidth = ColumnSizer.getTotalCellBorderWidth(borderWidthsInfo);
    const isLastCell = columnsDetails.length - 1 === sizerIndex;
    const marginRight = ColumnSizer.getMarginRight(borderWidthsInfo, isLastCell);
    const backgroundImage = ColumnSizer.getBackgroundImage(totalCellBorderWidth,
      borderWidthsInfo.leftCellLeft, borderWidthsInfo.beforeLeftCellRight, isLastCell, tableElement);
    // movableElement should be treated as always present in columnSizer, but InsertRemoveColumnSizer needs to create
    // a new object to overwrite its other properties
    const shouldWidthBeIncreased = ColumnSizer.shouldWidthBeIncreased(totalCellBorderWidth);
    const columnSizerState: Optional<ColumnSizerT, 'movableElement' | 'overlayElement' | 'hoverColor'> = {
      element: columnSizerElement,
      styles: {
        default: {
          width: shouldWidthBeIncreased ? `${totalCellBorderWidth + 2}px` : '1.5px',
          backgroundImage,
        },
        hover: {
          width: shouldWidthBeIncreased ? `${(totalCellBorderWidth + 2) * 1.5}px` : '9px',
        },
        static: {
          marginRight,
        }
      },
      isSideCellHovered: false,
      isSizerHovered: false,
      isMouseUpOnSizer: false,
    };
    if (columnResizerColors) {
      columnSizerState.hoverColor = columnResizerColors.hover || ColumnSizerElement.DEFAULT_HOVER_COLOR;
    }
    if (movableColumnSizer) columnSizerState.movableElement = movableColumnSizer;
    if (overlayElement) columnSizerState.overlayElement = overlayElement;
    return columnSizerState as ColumnSizerT;
  }

  // prettier-ignore
  public static create(at: ActiveTable, sizerIndex: number) {
    const {_columnsDetails, _tableElementRef, columnResizerColors} = at;
    const columnSizerElement = ColumnSizerElement.create(sizerIndex, columnResizerColors.hover);
    const movableColumnSizer = MovableColumnSizerElement.create(columnResizerColors);
    const overlayElement = ColumnSizerOverlayElement.create();
    const columnSizer = ColumnSizer.createObject(columnSizerElement, _columnsDetails, sizerIndex,
      _tableElementRef as HTMLElement, overlayElement, movableColumnSizer, columnResizerColors);
    ColumnSizerOverlayElement.applyEvents(at, columnSizer);
    return columnSizer;
  }
}
