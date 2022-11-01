import {ColumnsDetailsT} from '../../types/columnDetails';
import {ColumnSizerElement} from './columnSizerElement';
import {ColumnSizerT} from '../../types/columnSizer';

export class ColumnSizerCellEvents {
  private static hideColumnSizer(columnSizer: ColumnSizerT) {
    if (!columnSizer) return;
    columnSizer.isSideCellHovered = false;
    // cannot use columnSizer.isSizerHovered to identify if animation is present as it can be set to false before
    // this method is called, hence using the background image as an indicator and then checking if the sizer is
    // in fact not hovered in a timeout
    const isHovered = ColumnSizerElement.isHovered(columnSizer.element);
    setTimeout(() => {
      // check if mouse has not left the cell for the column sizer
      if (!columnSizer.isSizerHovered) ColumnSizerElement.hideWhenCellNotHovered(columnSizer, isHovered);
    });
  }

  public static cellMouseLeave(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    ColumnSizerCellEvents.hideColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer);
    ColumnSizerCellEvents.hideColumnSizer(columnsDetails[columnIndex]?.columnSizer);
  }

  private static displayColumnSizer(columnSizer: ColumnSizerT) {
    if (!columnSizer) return;
    ColumnSizerElement.display(columnSizer.element);
    columnSizer.isSideCellHovered = true;
  }

  public static cellMouseEnter(columnsDetails: ColumnsDetailsT, columnIndex: number) {
    ColumnSizerCellEvents.displayColumnSizer(columnsDetails[columnIndex - 1]?.columnSizer);
    ColumnSizerCellEvents.displayColumnSizer(columnsDetails[columnIndex]?.columnSizer);
  }
}
