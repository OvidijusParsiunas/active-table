import {StaticTableWidthUtils} from '../../utils/tableDimensions/staticTable/staticTableWidthUtils';
import {ToggleAdditionElements} from '../table/addNewElements/shared/toggleAdditionElements';
import {AddNewColumnElement} from '../table/addNewElements/column/addNewColumnElement';
import {TableDimensionsUtils} from '../../utils/tableDimensions/tableDimensionsUtils';
import {ExtractElements} from '../../utils/elements/extractElements';
import {Browser} from '../../utils/browser/browser';
import {TableElement} from '../table/tableElement';
import {ActiveTable} from '../../activeTable';
import {IndexColumn} from './indexColumn';

export class UpdateIndexColumnWidth {
  private static readonly TEMPORARY_INDEX_ID_PREFIX = 'active-table-temp-index-';
  private static readonly TEMPORARY_INDEX_ID_PREFIX_LENGTH = UpdateIndexColumnWidth.TEMPORARY_INDEX_ID_PREFIX.length;

  private static wrapColumnTextAndGetDefaultWidth(at: ActiveTable) {
    const {_tableBodyElementRef, data, _tableDimensions} = at;
    ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, data).forEach((row) => {
      const indexCell = row.children[0] as HTMLElement;
      indexCell.classList.remove(IndexColumn.INDEX_CELL_OVERFLOW_CLASS);
    });
    _tableDimensions.isColumnIndexCellTextWrapped = true;
    ToggleAdditionElements.update(at, true, AddNewColumnElement.toggle);
    return IndexColumn.DEFAULT_WIDTH;
  }

  private static changeTableWidths(at: ActiveTable, newWidth: number) {
    const difference = newWidth - at._tableDimensions.indexColumnWidth;
    at._tableDimensions.indexColumnWidth = newWidth;
    TableElement.changeStaticWidthTotal(at._tableDimensions, difference);
    StaticTableWidthUtils.changeWidthsBasedOnColumnInsertRemove(at, true);
  }

  private static changeCellAndTableWidths(at: ActiveTable, firstRow: HTMLElement, newWidth: number) {
    const headerCell = firstRow.children[0] as HTMLElement;
    UpdateIndexColumnWidth.changeTableWidths(at, newWidth);
    // needs to be done after changeTableWidths because isTableAtMaxWidth would not return true
    headerCell.style.width = `${newWidth}px`;
  }

  private static forceWrap(at: ActiveTable, firstRow: HTMLElement) {
    const newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(at);
    UpdateIndexColumnWidth.changeCellAndTableWidths(at, firstRow, newWidth);
  }

  private static shouldTextBeWrapped(at: ActiveTable) {
    return !at._tableDimensions.isColumnIndexCellTextWrapped && TableDimensionsUtils.hasSetTableWidthBeenBreached(at);
  }

  private static changeWidth(at: ActiveTable, firstRow: HTMLElement, newWidth: number) {
    UpdateIndexColumnWidth.changeCellAndTableWidths(at, firstRow, newWidth);
    // if the above has set the width too high
    if (UpdateIndexColumnWidth.shouldTextBeWrapped(at)) UpdateIndexColumnWidth.forceWrap(at, firstRow);
  }

  // important to note that on initial render if the font library has not been downloaded
  // scrollWidth will give the wrong number. This is usually not a problem when using
  // small numbers or cache
  private static getCellWidth(cell: HTMLElement) {
    return cell.scrollWidth + (Number.parseInt(getComputedStyle(cell).borderRightWidth) || 0);
  }

  // using a prefix because the same index cell can get overwritten multiple times by new last cells in pagination
  // hidden pages - so when resetting in a timeout - the reset value is no longer the original
  // to reproduce the error, simply set the following code in timeout: firstDataCell.textContent = firstCellContent
  // and either upload a new file, drag and rop a new files, updateData method with a lot of data
  private static temporarilySetFirstDataCellWithLastNumber(firstDataCell: HTMLElement, lastCell: HTMLElement) {
    const firstCellContent = firstDataCell.textContent;
    if (!firstDataCell.id) firstDataCell.id = `${UpdateIndexColumnWidth.TEMPORARY_INDEX_ID_PREFIX}${firstCellContent}`;
    firstDataCell.textContent = lastCell.textContent;
    setTimeout(() => {
      if (firstDataCell.id !== '') {
        firstDataCell.textContent = firstDataCell.id.substring(UpdateIndexColumnWidth.TEMPORARY_INDEX_ID_PREFIX_LENGTH);
        firstDataCell.removeAttribute('id');
      }
    });
  }

  private static getIndexColumnWidthWithAsyncFix(firstRow: HTMLElement, lastCell: HTMLElement) {
    // if using pagination and the last row is not visible, then scrollWidth will be 0 and we must temporarily add
    // the last cell content to the first data row cell to measure the overflow
    if (lastCell.scrollWidth === 0) {
      const firstDataCell = firstRow.children[0] as HTMLElement;
      UpdateIndexColumnWidth.temporarilySetFirstDataCellWithLastNumber(firstDataCell, lastCell);
      return UpdateIndexColumnWidth.getCellWidth(firstDataCell);
    }
    return UpdateIndexColumnWidth.getCellWidth(lastCell);
  }

  // this works because the 'block' display style is not set on the table
  // checking if the cells width is overflown and if so - increase its width (cannot decrease the width)
  private static updateColumnWidthWhenOverflow(at: ActiveTable, firstRow: HTMLElement, lastCell: HTMLElement) {
    const indexColumnWidth = UpdateIndexColumnWidth.getIndexColumnWidthWithAsyncFix(firstRow, lastCell);
    if (at._tableDimensions.indexColumnWidth !== indexColumnWidth && indexColumnWidth !== 0) {
      // Firefox does not include lastCell paddingRight (4px) when setting the new width
      const newWidth = indexColumnWidth + (Browser.IS_FIREFOX ? 4 : 0);
      if (Browser.IS_SAFARI) {
        setTimeout(() => UpdateIndexColumnWidth.changeWidth(at, firstRow, newWidth));
      } else {
        UpdateIndexColumnWidth.changeWidth(at, firstRow, newWidth);
      }
    }
  }

  // when the table element display property is 'block', the 'overflow: hidden;' property does not actually work
  // and instead the lastCell width is changed automatically, all we do here is check if the expected width
  // (at.tableDimensions.indexColumnWidth) is different to the actual one and if so, we change it to actual
  private static checkAutoColumnWidthUpdate(at: ActiveTable, lastCell: HTMLElement) {
    if (lastCell.offsetWidth !== at._tableDimensions.indexColumnWidth) {
      let newWidth = lastCell.offsetWidth;
      if (at.offsetWidth !== at.scrollWidth) {
        newWidth = UpdateIndexColumnWidth.wrapColumnTextAndGetDefaultWidth(at);
      }
      UpdateIndexColumnWidth.changeTableWidths(at, newWidth);
    }
  }

  private static updatedBasedOnTableStyle(at: ActiveTable, row: HTMLElement, lastCell: HTMLElement, forceWrap = false) {
    if (forceWrap) {
      UpdateIndexColumnWidth.forceWrap(at, row);
      // when 'block' display style is not set on the table
    } else if (at._tableDimensions.preserveNarrowColumns || at._tableDimensions.maxWidth !== undefined) {
      UpdateIndexColumnWidth.updateColumnWidthWhenOverflow(at, row, lastCell);
    } else if (at._tableDimensions.width !== undefined) {
      UpdateIndexColumnWidth.checkAutoColumnWidthUpdate(at, lastCell);
    }
  }

  private static getFirstVisibleRow(at: ActiveTable) {
    const {_pagination, _tableBodyElementRef, dataStartsAtHeader} = at;
    if (dataStartsAtHeader && _pagination) {
      return _pagination.visibleRows[0];
    }
    return _tableBodyElementRef?.children[0] as HTMLElement;
  }

  private static updatedBasedOnVisiblity(at: ActiveTable, lastCell: HTMLElement, forceWrap = false) {
    const firstRow = UpdateIndexColumnWidth.getFirstVisibleRow(at);
    if (at._pagination && at.filter) {
      if (firstRow) {
        UpdateIndexColumnWidth.updatedBasedOnTableStyle(at, firstRow, lastCell, forceWrap);
      } else {
        // when pagination is set, all rows have been filtered to not visible and new row is added via updateData
        // firstRow may not be defiened if a row is removed via updateData
        setTimeout(() => {
          const firstRow = UpdateIndexColumnWidth.getFirstVisibleRow(at);
          if (firstRow) UpdateIndexColumnWidth.updatedBasedOnTableStyle(at, firstRow, lastCell, forceWrap);
        });
      }
    } else if (firstRow) {
      UpdateIndexColumnWidth.updatedBasedOnTableStyle(at, firstRow, lastCell, forceWrap);
    }
  }

  // used when a new row is added
  // forceWrap - REF-19
  public static update(at: ActiveTable, textRowsArr?: Element[], forceWrap = false) {
    if (at._tableDimensions.isColumnIndexCellTextWrapped) return;
    if (!textRowsArr) {
      const {_tableBodyElementRef, data} = at;
      textRowsArr = ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, data);
    }
    const lastCell = textRowsArr[textRowsArr.length - 1]?.children[0] as HTMLElement;
    if (lastCell) UpdateIndexColumnWidth.updatedBasedOnVisiblity(at, lastCell, forceWrap);
  }

  // used when a new column is added to see if wrapping is needed
  // CAUTION-2 - this runs before re-render but stay cautions
  public static wrapTextWhenNarrowColumnsBreached(at: ActiveTable) {
    if (at._frameComponents.displayIndexColumn && UpdateIndexColumnWidth.shouldTextBeWrapped(at)) {
      UpdateIndexColumnWidth.update(at, undefined, true);
    }
  }
}
