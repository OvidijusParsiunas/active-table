import {NumberOfVisibleRowsElement} from '../../elements/pagination/numberOfVisibleRows/numberOfVisibleRowsElement';
import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationPageActionButtonUtils} from './paginationPageActionButtonUtils';
import {PaginationVisibleButtonsUtils} from './paginationVisibleButtonsUtils';
import {PaginationUpdatePageButtons} from './paginationUpdatePageButtons';
import {PaginationInternal} from '../../types/paginationInternal';
import {CustomRowProperties} from '../rows/customRowProperties';
import {ExtractElements} from '../elements/extractElements';
import {CellElement} from '../../elements/cell/cellElement';
import {ActiveTable} from '../../activeTable';

export class PaginationUtils {
  private static readonly HIDDEN_ROW_CLASS = 'hidden-row';

  // prettier-ignore
  public static getLastPossiblePageNumber(at: ActiveTable, isBeforeInsert = false) {
    const {content, _pagination, dataStartsAtHeader} = at;
    if (_pagination.isAllRowsOptionSelected) return 1;
    const contentLength = dataStartsAtHeader ? content.length + 1 : content.length;
    const numberOfRows = isBeforeInsert ? contentLength : contentLength - 1;
    return Math.max(Math.ceil(numberOfRows / _pagination.rowsPerPage), 1);
  }

  public static getPageNumberButtons(pagination: PaginationInternal) {
    const {buttonContainer, numberOfActionButtons} = pagination;
    const allButtons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfSideButtons = numberOfActionButtons / 2;
    return allButtons.slice(halfOfSideButtons, allButtons.length - halfOfSideButtons);
  }

  public static getRelativeRowIndexes(at: ActiveTable, rowIndex = 0) {
    const {activePageNumber, rowsPerPage, isAllRowsOptionSelected} = at._pagination;
    let maxVisibleRowIndex = isAllRowsOptionSelected ? at.content.length + 1 : activePageNumber * rowsPerPage;
    if (!at.dataStartsAtHeader) maxVisibleRowIndex += 1;
    const minVisibleRowIndex = maxVisibleRowIndex - rowsPerPage;
    const visibleRowIndex = rowIndex - minVisibleRowIndex;
    return {maxVisibleRowIndex, minVisibleRowIndex, visibleRowIndex};
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

  public static displayRow(rowElement: HTMLElement) {
    if ((rowElement.children[0] as HTMLElement).tagName === CellElement.HEADER_TAG) {
      rowElement.classList.remove(PaginationUtils.HIDDEN_ROW_CLASS);
    } else {
      rowElement.style.display = '';
    }
  }

  // changes to the page that the row was moved to
  public static updateOnRowMove(at: ActiveTable, rowIndex: number) {
    const {activePageNumber} = at._pagination;
    const {maxVisibleRowIndex, minVisibleRowIndex} = PaginationUtils.getRelativeRowIndexes(at, rowIndex);
    if (maxVisibleRowIndex <= rowIndex) {
      PaginationUtils.displayRowsForDifferentButton(at, activePageNumber + 1);
    } else if (rowIndex > 0 && rowIndex < minVisibleRowIndex) {
      PaginationUtils.displayRowsForDifferentButton(at, activePageNumber - 1);
    }
  }

  private static updateRowsOnRemoval(at: ActiveTable, rowIndex: number) {
    const {visibleRows, activePageNumber} = at._pagination;
    const {visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(at, rowIndex);
    visibleRows.splice(visibleRowIndex, 1);
    if (visibleRows.length > 0) {
      const lastVisibleRow = visibleRows[visibleRows.length - 1];
      const nextRow = lastVisibleRow?.nextSibling as HTMLElement;
      if (nextRow && !AddNewRowElement.isAddNewRowRow(nextRow)) {
        PaginationUtils.displayRow(nextRow as HTMLElement);
        visibleRows.push(nextRow);
      }
    } else if (activePageNumber > 1) {
      PaginationUtils.displayRowsForDifferentButton(at, activePageNumber - 1);
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
    const {maxVisibleRowIndex, visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(at, rowIndex);
    if (maxVisibleRowIndex > rowIndex) {
      if (visibleRows.length === rowsPerPage && !isAllRowsOptionSelected) {
        PaginationUtils.hideLastVisibleRow(at._pagination);
      }
      visibleRows.splice(visibleRowIndex, 0, newRowElement);
    } else {
      PaginationUtils.hideRow(newRowElement);
      // wait for a new button to be created when on last
      setTimeout(() => PaginationUtils.displayRowsForDifferentButton(at, activePageNumber + 1));
    }
  }

  // prettier-ignore
  public static updateOnRowChange(at: ActiveTable, rowIndex: number, newRowElement?: HTMLElement) {
    const {dataStartsAtHeader, content, _pagination} = at;
    if (!dataStartsAtHeader && rowIndex === 0 && content.length === 0) return;
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
      CustomRowProperties.updateRow(at, addRowRowElement, rowIndex, rowIndex, isAddRowEven);
    }
  }

  // prettier-ignore
  private static setCorrectRowsAsVisible(at: ActiveTable, buttonNumber: number) {
    const {_pagination: {rowsPerPage, visibleRows}, _tableBodyElementRef, content} = at;
    const tableRows = ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, content);
    let startingRowIndex = rowsPerPage * (buttonNumber - 1);
    if (!at.dataStartsAtHeader) startingRowIndex += 1; 
    tableRows.slice(startingRowIndex, startingRowIndex + rowsPerPage).forEach((rowElement) => {
      PaginationUtils.displayRow(rowElement as HTMLElement);
      visibleRows.push(rowElement as HTMLElement);
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
}
