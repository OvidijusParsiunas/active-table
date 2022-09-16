import {BorderWidths, ColumnSizerElement} from '../../elements/columnSizerElement/columnSizerElement';
import {ColumnSizerEvents} from '../../elements/columnSizerElement/columnSizerEvents';
import {ColumnsDetailsT, ColumnSizerT} from '../../types/columnDetails';
import {EditableTableComponent} from '../../editable-table-component';
import {PX} from '../../types/pxDimension';

export class ColumnSizer {
  public static shouldWidthBeIncreased(widthPx: number) {
    return widthPx > 4;
  }

  // prettier-ignore
  private static getBackgroundImage(
      totalCellBorderWidth: number, beforeLeftCellRight: number, isLastCell: boolean, tableElement?: HTMLElement) {
    // REF-1
    // right border is not placed on the rightmost cell and is instead controlled by the table border
    // the strategy here is to have a default column sizer background image if the table has no border or even if it does
    // and the cells do not as to maintain consistency
    // howver do not have a default column sizer background image if both cells and table have a border, for the  purposes
    // of consistency
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

  private static getMarginLeft(borderWidths: BorderWidths): PX {
    const marginLeft = borderWidths ? borderWidths.leftCellRight - borderWidths.rightCellLeft : 0;
    return `${-marginLeft}px`;
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
  public static createObject(columnSizerElement: HTMLElement,
      columnsDetails: ColumnsDetailsT, sizerIndex: number, tableElement?: HTMLElement): ColumnSizerT {
    const borderWidthsInfo = ColumnSizer.generateBorderWidthsInfo(columnsDetails, sizerIndex);
    const totalCellBorderWidth = ColumnSizer.getTotalCellBorderWidth(borderWidthsInfo);
    const marginLeft = ColumnSizer.getMarginLeft(borderWidthsInfo);
    const backgroundImage = ColumnSizer.getBackgroundImage(totalCellBorderWidth,
      borderWidthsInfo.beforeLeftCellRight, columnsDetails.length - 1 === sizerIndex, tableElement);
    const columnSizerState: ColumnSizerT = {
      element: columnSizerElement,
      styles: {
        default: {
          width: ColumnSizer.shouldWidthBeIncreased(totalCellBorderWidth) ? `${totalCellBorderWidth}px` : '0.1px',
          backgroundImage,
        },
        hover: {
          width: ColumnSizer.shouldWidthBeIncreased(totalCellBorderWidth) ? `${totalCellBorderWidth * 1.5}px` : '7px',
        },
        permanent: {
          marginLeft,
        }
      },
      isSizerHovered: false,
      isSideCellHovered: false,
    };
    return columnSizerState;
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, sizerIndex: number) {
    const { columnsDetails, tableElementRef } = etc;
    const columnSizerElement = ColumnSizerElement.createElement(sizerIndex);
    const columnSizer = ColumnSizer.createObject(
      columnSizerElement, columnsDetails, sizerIndex, tableElementRef as HTMLElement);
    columnSizerElement.onmouseenter = ColumnSizerEvents.sizerOnMouseEnter.bind(etc, columnSizer);
    columnSizerElement.onmouseleave = ColumnSizerEvents.sizerOnMouseLeave.bind(etc, columnSizer);
    return columnSizer;
  }
}
