import {StaticTableWidthUtils} from '../../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {TableDimensionsUtils} from '../../../utils/tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {ExtractElements} from '../../../utils/elements/extractElements';
import {Browser} from '../../../utils/browser/browser';
import {TableElement} from '../tableElement';
import {IndexColumn} from './indexColumn';

export class UpdateIndexColumnWidth {
  // acts as the recorded column offsetWidth
  public static WIDTH = 30;

  private static wrapColumnTextAndGetDefaultWidth(etc: EditableTableComponent) {
    const {tableBodyElementRef, contents, tableDimensionsInternal} = etc;
    ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents).forEach((row) => {
      const indexCell = row.children[0] as HTMLElement;
      indexCell.classList.remove(IndexColumn.INDEX_CELL_OVERFLOW_CLASS);
    });
    tableDimensionsInternal.isColumnIndexCellTextWrapped = true;
    return IndexColumn.DEFAULT_WIDTH;
  }

  private static changeColumnWidth(etc: EditableTableComponent, newWidth: number, forceWrap = false) {
    // when preserveNarrowColumns is set - offsetWidth & scrollWidth will be the same, hence using forceWrap flag - REF-19
    if (forceWrap || etc.offsetWidth !== etc.scrollWidth) {
      newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(etc);
    }
    const difference = newWidth - UpdateIndexColumnWidth.WIDTH;
    UpdateIndexColumnWidth.WIDTH = newWidth;
    TableElement.changeAuxiliaryTableContentWidth(difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(etc, true);
  }

  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  // prettier-ignore
  private static updateColumnWidthWhenOverflow(etc: EditableTableComponent,
      firstRow: HTMLElement, lastCell: HTMLElement, forceWrap = false) {
    // overflow width does not include the borderRightWidth - which the ChangeIndexColumnWidth.WIDTH does
    const overflowWidth = lastCell.scrollWidth + (Number.parseInt(lastCell.style.borderRightWidth) || 0);
    if (forceWrap || UpdateIndexColumnWidth.WIDTH !== overflowWidth) {
      // Firefox does not include lastCell paddingRight (4px) when setting the new width
      const newWidth = forceWrap ?  IndexColumn.DEFAULT_WIDTH : overflowWidth + (Browser.IS_FIREFOX ? 4 : 0);
      const headerCell = firstRow.children[0] as HTMLElement;
      headerCell.style.width = `${newWidth}px`;
      UpdateIndexColumnWidth.changeColumnWidth(etc, newWidth, forceWrap);
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the lastCell width is change automatically, all we do here is check if the expected width
  // (ChangeIndexColumnWidth.WIDTH) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthUpdate(etc: EditableTableComponent, lastCell: HTMLElement) {
    if (lastCell.offsetWidth !== UpdateIndexColumnWidth.WIDTH) {
      UpdateIndexColumnWidth.changeColumnWidth(etc, lastCell.offsetWidth);
    }
  }

  // prettier-ignore
  private static updatedBasedOnTableStyle(etc: EditableTableComponent, lastCell: HTMLElement, forceWrap = false) {
    const firstRow = (etc.tableBodyElementRef as HTMLElement).children[0] as HTMLElement;
    if (forceWrap || etc.tableDimensionsInternal.maxWidth !== undefined ||
        // when preserveNarrowColumns is true - 'block' display style is not set on table
        (etc.tableDimensionsInternal.width !== undefined && etc.tableDimensionsInternal.preserveNarrowColumns)) {
      UpdateIndexColumnWidth.updateColumnWidthWhenOverflow(etc, firstRow, lastCell, forceWrap);
    } else if (etc.tableDimensionsInternal.width !== undefined) {
      UpdateIndexColumnWidth.checkAutoColumnWidthUpdate(etc, lastCell);
    }
  }

  // forceWrap - REF-19
  public static update(etc: EditableTableComponent, textRowsArr?: Element[], forceWrap = false) {
    if (!textRowsArr) {
      const {tableBodyElementRef, contents} = etc;
      textRowsArr = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
    }
    const lastCell = textRowsArr[textRowsArr.length - 1]?.children[0] as HTMLElement;
    if (lastCell) UpdateIndexColumnWidth.updatedBasedOnTableStyle(etc, lastCell, forceWrap);
  }

  // CAUTION-2 - if the table rerenders - this appears to run before it
  // prettier-ignore
  public static wrapTextWhenNarrowColumnsBreached(etc: EditableTableComponent) {
    const {displayIndexColumn, tableDimensionsInternal} = etc;
    if (displayIndexColumn &&
        TableDimensionsUtils.hasSetTableWidthBeenBreached(etc) && !tableDimensionsInternal.isColumnIndexCellTextWrapped) {
      // this is called when preserveNarrowColumns is set to true - meaning that the display style 'block' is not set,
      // hence the column index head cell's width will have to be set using the updateColumnWidthWhenOverflow method
      UpdateIndexColumnWidth.update(etc, undefined, true);
    }
  }
}
