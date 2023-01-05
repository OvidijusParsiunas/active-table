import {NumberOfVisibleRowsElement} from '../../elements/pagination/numberOfVisibleRows/numberOfVisibleRowsElement';
import {PageButtonContainerElement} from '../../elements/pagination/pageButtons/pageButtonContainerElement';
import {PageButtonElement} from '../../elements/pagination/pageButtons/pageButtonElement';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationPageActionButtonUtils} from './paginationPageActionButtonUtils';
import {PaginationUpdatePageButtons} from './paginationUpdatePageButtons';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationInternal} from '../../types/paginationInternal';
import {ExtractElements} from '../elements/extractElements';
import {CellElement} from '../../elements/cell/cellElement';

export class PaginationUtils {
  private static HIDDEN_ROW_CLASS = 'hidden-row';

  // prettier-ignore
  public static getLastPossiblePageNumber(etc: EditableTableComponent, isBeforeInsert = false) {
    const {contents, paginationInternal, auxiliaryTableContentInternal: {indexColumnCountStartsAtHeader}} = etc;
    if (paginationInternal.isAllRowsOptionSelected) return 1;
    const contentLength = indexColumnCountStartsAtHeader ? contents.length + 1 : contents.length;
    const numberOfRows = isBeforeInsert ? contentLength : contentLength - 1;
    return Math.ceil(numberOfRows / paginationInternal.numberOfRows);
  }

  public static getPageNumberButtons(buttonContainer: HTMLElement) {
    const allButtons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfSideButtons = PageButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2;
    return allButtons.slice(halfOfSideButtons, allButtons.length - halfOfSideButtons);
  }

  public static getRelativeRowIndexes(etc: EditableTableComponent, rowIndex = 0) {
    const {activePageNumber, numberOfRows, isAllRowsOptionSelected} = etc.paginationInternal;
    let maxVisibleRowIndex = isAllRowsOptionSelected ? etc.contents.length + 1 : activePageNumber * numberOfRows;
    if (!etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader) maxVisibleRowIndex += 1;
    const minVisibleRowIndex = maxVisibleRowIndex - numberOfRows;
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

  private static updateRowsOnRemoval(etc: EditableTableComponent, rowIndex: number) {
    const {visibleRows, activePageNumber} = etc.paginationInternal;
    const {visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(etc, rowIndex);
    visibleRows.splice(visibleRowIndex, 1);
    if (visibleRows.length > 0) {
      const lastVisibleRow = visibleRows[visibleRows.length - 1];
      const nextRow = lastVisibleRow?.nextSibling as HTMLElement;
      if (nextRow && nextRow.children[0]?.id !== AddNewRowElement.ID) {
        PaginationUtils.displayRow(nextRow as HTMLElement);
        visibleRows.push(nextRow);
      }
    } else if (activePageNumber > 1) {
      PaginationUtils.displayRowsForDifferentButton(etc, activePageNumber - 1);
    }
  }

  public static hideLastVisibleRow(paginationInternal: PaginationInternal) {
    const {visibleRows} = paginationInternal;
    if (visibleRows.length === 0) return;
    const lastRow = visibleRows[visibleRows.length - 1];
    PaginationUtils.hideRow(lastRow);
    paginationInternal.visibleRows.splice(paginationInternal.visibleRows.length - 1, 1);
  }

  private static updateRowsOnNewInsert(etc: EditableTableComponent, rowIndex: number, newRowElement: HTMLElement) {
    const {numberOfRows, visibleRows, activePageNumber, isAllRowsOptionSelected} = etc.paginationInternal;
    const {maxVisibleRowIndex, visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(etc, rowIndex);
    if (maxVisibleRowIndex > rowIndex) {
      if (visibleRows.length === numberOfRows && !isAllRowsOptionSelected) {
        PaginationUtils.hideLastVisibleRow(etc.paginationInternal);
      }
      visibleRows.splice(visibleRowIndex, 0, newRowElement);
    } else {
      PaginationUtils.hideRow(newRowElement);
      // wait for a new button to be created when on last
      setTimeout(() => PaginationUtils.displayRowsForDifferentButton(etc, activePageNumber + 1));
    }
  }

  // prettier-ignore
  public static updateOnRowChange(etc: EditableTableComponent, rowIndex: number, newRowElement?: HTMLElement) {
    if (!etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader
        && rowIndex === 0 && etc.contents.length === 0) return;
    // buttons need to be updated first as displayRowsForDifferentButton will use them to toggle the side buttons
    if (newRowElement) {
      PaginationUpdatePageButtons.updateOnRowInsert(etc);
      PaginationUtils.updateRowsOnNewInsert(etc, rowIndex, newRowElement);
    } else {
      PaginationUpdatePageButtons.updateOnRowRemove(etc);
      PaginationUtils.updateRowsOnRemoval(etc, rowIndex);
    }
    PaginationPageActionButtonUtils.toggleActionButtons(etc, etc.paginationInternal.buttonContainer);
    setTimeout(() => NumberOfVisibleRowsElement.update(etc));
  }

  public static initialRowUpdates(etc: EditableTableComponent, rowIndex: number, newRowElement: HTMLElement) {
    const dataRowIndex = etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? rowIndex + 1 : rowIndex;
    if (dataRowIndex > etc.paginationInternal.numberOfRows) {
      PaginationUtils.hideRow(newRowElement);
    } else if (dataRowIndex > 0) {
      etc.paginationInternal.visibleRows.push(newRowElement);
    }
  }

  // prettier-ignore
  private static setCorrectRowsAsVisible(etc: EditableTableComponent, buttonNumber: number) {
    const {paginationInternal: {numberOfRows, visibleRows}, tableBodyElementRef, contents} = etc;
    const tableRows = ExtractElements.textRowsArrFromTBody(tableBodyElementRef as HTMLElement, contents);
    let startingRowIndex = numberOfRows * (buttonNumber - 1);
    if (!etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader) startingRowIndex += 1; 
    tableRows.slice(startingRowIndex, startingRowIndex + numberOfRows).forEach((rowElement) => {
      PaginationUtils.displayRow(rowElement as HTMLElement);
      visibleRows.push(rowElement as HTMLElement);
    });
  }

  private static hideAllRows(paginationInternal: PaginationInternal) {
    paginationInternal.visibleRows.forEach((rowElement) => PaginationUtils.hideRow(rowElement));
    paginationInternal.visibleRows = [];
  }

  public static displayRowsForDifferentButton(etc: EditableTableComponent, buttonNumber: number) {
    PaginationUtils.hideAllRows(etc.paginationInternal);
    PaginationUtils.setCorrectRowsAsVisible(etc, buttonNumber);
    PageButtonElement.setActive(etc, etc.paginationInternal.buttonContainer, buttonNumber);
    NumberOfVisibleRowsElement.update(etc);
  }
}
