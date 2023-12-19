import {NumberOfVisibleRowsElement} from '../../../elements/pagination/numberOfVisibleRows/numberOfVisibleRowsElement';
import {PageButtonElement} from '../../../elements/pagination/pageButtons/pageButtonElement';
import {AddNewRowElement} from '../../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationPageActionButtonUtils} from './paginationPageActionButtonUtils';
import {PaginationVisibleButtonsUtils} from './paginationVisibleButtonsUtils';
import {PaginationUpdatePageButtons} from './paginationUpdatePageButtons';
import {FilterInternalUtils} from '../filter/rows/filterInternalUtils';
import {PaginationInternal} from '../../../types/paginationInternal';
import {CustomRowProperties} from '../../rows/customRowProperties';
import {PaginationInternalUtils} from './paginationInternalUtils';
import {ExtractElements} from '../../elements/extractElements';
import {CellElement} from '../../../elements/cell/cellElement';
import {PaginationRowIndexes} from './paginationRowIndexes';
import {ActiveTable} from '../../../activeTable';

export class PaginationUtils {
  private static readonly HIDDEN_ROW_CLASS = 'hidden-row';

  // prettier-ignore
  public static getLastPossiblePageNumber(at: ActiveTable, isBeforeInsert = false) {
    const {_pagination, dataStartsAtHeader} = at;
    if (_pagination.isAllRowsOptionSelected) return 1;
    const totalNumberOfRows = PaginationInternalUtils.getTotalNumberOfRows(at);
    const contentLength = dataStartsAtHeader ? totalNumberOfRows + 1 : totalNumberOfRows;
    const numberOfRows = isBeforeInsert ? contentLength : contentLength - 1;
    return Math.max(Math.ceil(numberOfRows / _pagination.rowsPerPage), 1);
  }

  public static getPageNumberButtons(pagination: PaginationInternal) {
    const {buttonContainer, numberOfActionButtons} = pagination;
    const allButtons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfSideButtons = numberOfActionButtons / 2;
    return allButtons.slice(halfOfSideButtons, allButtons.length - halfOfSideButtons);
  }

  private static hideRow(rowElement: HTMLElement) {
    // cannot set display to 'none' for header as column widths will no longer be applied
    // visability: collapse does not work in safari hence using the below for consistency
    // if all cell tags are going to be 'TD' then use a class to identify the header row
    if (rowElement.children[0]?.tagName === CellElement.HEADER_TAG) {
      rowElement.classList.add(PaginationUtils.HIDDEN_ROW_CLASS);
    } else {
      rowElement.style.display = 'none';
    }
  }

  private static displayRow(rowElement: HTMLElement, visibleRows: HTMLElement[]) {
    if ((rowElement.children[0] as HTMLElement).tagName === CellElement.HEADER_TAG) {
      rowElement.classList.remove(PaginationUtils.HIDDEN_ROW_CLASS);
    } else {
      rowElement.style.display = '';
    }
    visibleRows.push(rowElement as HTMLElement);
  }

  // changes to the page that the row was moved to
  public static updateOnRowMove(at: ActiveTable, rowIndex: number) {
    const {activePageNumber} = at._pagination;
    if (PaginationRowIndexes.getMaxVisibleRowIndex(at) <= rowIndex) {
      PaginationUtils.displayRowsForDifferentButton(at, activePageNumber + 1);
    } else if (rowIndex > 0 && at._tableBodyElementRef) {
      if (rowIndex < PaginationRowIndexes.getVisibleRowRealIndex(at._tableBodyElementRef, at._pagination, 0)) {
        PaginationUtils.displayRowsForDifferentButton(at, activePageNumber - 1);
      }
    }
  }

  // prettier-ignore
  private static getSiblingVisibleRow(
      row: HTMLElement, sibling: 'nextSibling' | 'previousSibling'): HTMLElement | undefined {
    const siblingRow = row?.[sibling] as HTMLElement;
    if (!siblingRow || AddNewRowElement.isAddNewRowRow(siblingRow)) return undefined;
    if (siblingRow.classList.contains(FilterInternalUtils.HIDDEN_ROW_CLASS)) {
      return PaginationUtils.getSiblingVisibleRow(siblingRow, sibling);
    }
    return siblingRow;
  }

  private static updateRowsOnRemoval(at: ActiveTable, visibleIndex: number) {
    const {visibleRows, activePageNumber} = at._pagination;
    // bug fix - filtering to one page and removing row via updateData that is not visible would remove a visible row
    if (activePageNumber === 1 && visibleIndex === -1) return;
    visibleRows.splice(visibleIndex, 1);
    if (visibleRows.length > 0) {
      const lastVisibleRow = visibleRows[visibleRows.length - 1];
      const nextRow = PaginationUtils.getSiblingVisibleRow(lastVisibleRow, 'nextSibling');
      if (nextRow) PaginationUtils.displayRow(nextRow, visibleRows);
    } else if (activePageNumber > 1) {
      PaginationUtils.displayRowsForDifferentButton(at, activePageNumber - 1);
      // bug fix - filtering to two pages - on second one with one row left and removing filtered out row from the first
      // would cause the page to change to first, but we can't know if filtered was removed - so check to see if second
      // page is still there and if it is - navigate
      if (at._visiblityInternal.filters && PaginationUtils.getLastPossiblePageNumber(at) !== activePageNumber - 1) {
        PaginationUtils.displayRowsForDifferentButton(at, activePageNumber);
      }
    }
  }

  public static hideLastVisibleRow(pagination: PaginationInternal) {
    const {visibleRows} = pagination;
    if (visibleRows.length === 0) return;
    const lastRow = visibleRows[visibleRows.length - 1];
    PaginationUtils.hideRow(lastRow);
    pagination.visibleRows.splice(pagination.visibleRows.length - 1, 1);
  }

  private static updateRowsOnNewInsert(at: ActiveTable, rowIndex: number, newRowElement: HTMLElement) {
    const {rowsPerPage, visibleRows, activePageNumber, isAllRowsOptionSelected} = at._pagination;
    if (PaginationRowIndexes.getMaxVisibleRowIndex(at) > rowIndex && at._tableBodyElementRef) {
      if (visibleRows.length === rowsPerPage && !isAllRowsOptionSelected) {
        PaginationUtils.hideLastVisibleRow(at._pagination);
      }
      // this should not be triggered by add new row cell at the bottom - if so - refactoring will be required
      const visibleIndex = PaginationRowIndexes.getVisibleRowIndex(at._tableBodyElementRef, at._pagination, rowIndex);
      visibleRows.splice(visibleIndex === -1 ? visibleRows.length : visibleIndex, 0, newRowElement);
    } else {
      PaginationUtils.hideRow(newRowElement);
      // wait for a new button to be created when on last
      setTimeout(() => {
        const lastPageNumber = PaginationUtils.getLastPossiblePageNumber(at);
        const newPageNumber = activePageNumber + 1;
        if (lastPageNumber < newPageNumber) {
          // fix for error when using pagination, filtered down to 1 page and adding row via updateStructure to second page
          PaginationUtils.setCorrectRowsAsVisible(at, lastPageNumber);
        } else {
          PaginationUtils.displayRowsForDifferentButton(at, newPageNumber);
        }
      });
    }
  }

  // for removal - we pass visible row index as when filter is set - we need to get it before the element is removed
  public static updateOnRowChange(at: ActiveTable, rowIndex: number, newRowElement?: HTMLElement) {
    const {dataStartsAtHeader, _pagination} = at;
    if (!dataStartsAtHeader && rowIndex === 0 && PaginationInternalUtils.getTotalNumberOfRows(at) === 0) return;
    PaginationVisibleButtonsUtils.unsetStateAndStyles(_pagination);
    // buttons need to be updated first as displayRowsForDifferentButton will use them to toggle the side buttons
    if (newRowElement) {
      PaginationUpdatePageButtons.updateOnRowInsert(at);
      PaginationUtils.updateRowsOnNewInsert(at, rowIndex, newRowElement);
    } else {
      PaginationUpdatePageButtons.updateOnRowRemove(at);
      PaginationUtils.updateRowsOnRemoval(at, rowIndex);
    }
    PaginationPageActionButtonUtils.toggleActionButtons(at);
    PaginationVisibleButtonsUtils.setStateAndStyles(at);
    setTimeout(() => NumberOfVisibleRowsElement.update(at));
  }

  public static initialRowUpdates(at: ActiveTable, rowIndex: number, newRowElement: HTMLElement) {
    const dataRowIndex = at.dataStartsAtHeader ? rowIndex + 1 : rowIndex;
    if (dataRowIndex > at._pagination.rowsPerPage) {
      PaginationUtils.hideRow(newRowElement);
    } else if (dataRowIndex > 0) {
      at._pagination.visibleRows.push(newRowElement);
    }
  }

  // REF-32
  private static updateAddRowRow(at: ActiveTable) {
    if (at._stripedRows && at._tableBodyElementRef && at._addRowCellElementRef) {
      const addRowRowElement = at._addRowCellElementRef.parentElement as HTMLElement;
      const rowIndex = (Array.from(at._tableBodyElementRef.children) as HTMLElement[]).length - 1;
      const isAddRowEven = PaginationUtils.getLastPossiblePageNumber(at) !== at._pagination.activePageNumber;
      CustomRowProperties.updateRow(at, addRowRowElement, rowIndex, isAddRowEven, rowIndex);
    }
  }

  // prettier-ignore
  private static setCorrectRowsAsVisible(at: ActiveTable, buttonNumber: number) {
    const {_pagination: {rowsPerPage, visibleRows}, _tableBodyElementRef, data, _visiblityInternal} = at;
    const tableRows = _visiblityInternal?.filters
      ? FilterInternalUtils.extractUnfilteredRows(_tableBodyElementRef as HTMLElement, data.length)
      : ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, data)
    let startingRowIndex = rowsPerPage * (buttonNumber - 1);
    if (!at.dataStartsAtHeader) startingRowIndex += 1; 
    tableRows.slice(startingRowIndex, startingRowIndex + rowsPerPage).forEach((rowElement) => {
      PaginationUtils.displayRow(rowElement as HTMLElement, visibleRows);
    });
  }

  private static hideAllRows(pagination: PaginationInternal) {
    pagination.visibleRows.forEach((rowElement) => PaginationUtils.hideRow(rowElement));
    pagination.visibleRows = [];
  }

  public static displayRowsForDifferentButton(at: ActiveTable, buttonNumber: number) {
    PaginationUtils.hideAllRows(at._pagination);
    PaginationUtils.setCorrectRowsAsVisible(at, buttonNumber);
    PageButtonElement.setActive(at, buttonNumber);
    NumberOfVisibleRowsElement.update(at);
    if (at._frameComponents.displayAddNewRow) PaginationUtils.updateAddRowRow(at);
  }

  public static getFirstVisibleRow(visibleRows: HTMLElement[]) {
    return visibleRows.find((row) => !row.classList.contains(FilterInternalUtils.HIDDEN_ROW_CLASS));
  }
}
