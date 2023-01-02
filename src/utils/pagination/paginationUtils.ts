// eslint-disable-next-line max-len
import {PaginationButtonContainerElement} from '../../elements/pagination/buttonContainer/paginationButtonContainerElement';
import {NumberOfVisibleRowsElement} from '../../elements/pagination/numberOfVisibleRows/numberOfVisibleRowsElement';
import {PaginationButtonElement} from '../../elements/pagination/buttonContainer/paginationButtonElement';
import {AddNewRowElement} from '../../elements/table/addNewElements/row/addNewRowElement';
import {PaginationActionButtonUtils} from './paginationActionButtonUtils';
import {EditableTableComponent} from '../../editable-table-component';
import {PaginationInternal} from '../../types/paginationInternal';
import {PaginationUpdateButtons} from './paginationUpdateButtons';
import {ExtractElements} from '../elements/extractElements';

export class PaginationUtils {
  private static readonly VISIBLE_ROW = '';
  // using visibility collapse instead of display: 'none' because when indexColumnCountStartsAtHeader is set to true
  // and we make the header element, it would no longer apply column width property
  private static readonly COLLAPSED_ROW = 'collapse';

  // prettier-ignore
  public static getLastPossibleButtonNumber(etc: EditableTableComponent, isBeforeInsert = false) {
    const {contents, paginationInternal, auxiliaryTableContentInternal: {indexColumnCountStartsAtHeader}} = etc;
    const contentLength = indexColumnCountStartsAtHeader ? contents.length + 1 : contents.length;
    const numberOfRows = isBeforeInsert ? contentLength : contentLength - 1;
    return Math.ceil(numberOfRows / paginationInternal.numberOfRows);
  }

  public static getNumberButtons(buttonContainer: HTMLElement) {
    const allButtons = Array.from(buttonContainer.children) as HTMLElement[];
    const halfOfSideButtons = PaginationButtonContainerElement.NUMBER_OF_ACTION_BUTTONS / 2;
    return allButtons.slice(halfOfSideButtons, allButtons.length - halfOfSideButtons);
  }

  public static getRelativeRowIndexes(etc: EditableTableComponent, rowIndex = 0) {
    const {activeButtonNumber, numberOfRows} = etc.paginationInternal;
    let maxVisibleRowIndex = activeButtonNumber * numberOfRows;
    if (!etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader) maxVisibleRowIndex += 1;
    const minVisibleRowIndex = maxVisibleRowIndex - numberOfRows;
    const visibleRowIndex = rowIndex - minVisibleRowIndex;
    return {maxVisibleRowIndex, minVisibleRowIndex, visibleRowIndex};
  }

  private static updateRowsOnRemoval(etc: EditableTableComponent, rowIndex: number) {
    const {visibleRows, activeButtonNumber} = etc.paginationInternal;
    const {visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(etc, rowIndex);
    visibleRows.splice(visibleRowIndex, 1);
    if (visibleRows.length > 0) {
      const lastVisibleRow = visibleRows[visibleRows.length - 1];
      const nextRow = lastVisibleRow?.nextSibling as HTMLElement;
      if (nextRow && nextRow.children[0]?.id !== AddNewRowElement.ID) {
        nextRow.style.visibility = PaginationUtils.VISIBLE_ROW;
        visibleRows.push(nextRow);
      }
    } else if (activeButtonNumber > 1) {
      PaginationUtils.displayRowsForDifferentButton(etc, activeButtonNumber - 1);
    }
  }

  public static hideLastVisibleRow(paginationInternal: PaginationInternal) {
    const {visibleRows} = paginationInternal;
    if (visibleRows.length === 0) return;
    const lastRow = visibleRows[visibleRows.length - 1];
    lastRow.style.visibility = PaginationUtils.COLLAPSED_ROW;
    paginationInternal.visibleRows.splice(paginationInternal.visibleRows.length - 1, 1);
  }

  private static updateRowsOnNewInsert(etc: EditableTableComponent, rowIndex: number, newRowElement: HTMLElement) {
    const {numberOfRows, visibleRows, activeButtonNumber} = etc.paginationInternal;
    const {maxVisibleRowIndex, visibleRowIndex} = PaginationUtils.getRelativeRowIndexes(etc, rowIndex);
    if (maxVisibleRowIndex > rowIndex) {
      if (visibleRows.length === numberOfRows) PaginationUtils.hideLastVisibleRow(etc.paginationInternal);
      visibleRows.splice(visibleRowIndex, 0, newRowElement);
    } else {
      // visibility collapse does not allow the application of validation styling, hence first hiding, then collapsing
      newRowElement.style.display = 'none';
      setTimeout(() => {
        newRowElement.style.visibility = PaginationUtils.COLLAPSED_ROW;
        newRowElement.style.display = '';
        // wait for a new button to be created when on last
        PaginationUtils.displayRowsForDifferentButton(etc, activeButtonNumber + 1);
      });
    }
  }

  // prettier-ignore
  public static updateOnRowChange(etc: EditableTableComponent, rowIndex: number, newRowElement?: HTMLElement) {
    if (!etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader
        && rowIndex === 0 && etc.contents.length === 0) return;
    // buttons need to be updated first as displayRowsForDifferentButton will use them to toggle the side buttons
    if (newRowElement) {
      PaginationUpdateButtons.updateOnRowInsert(etc);
      PaginationUtils.updateRowsOnNewInsert(etc, rowIndex, newRowElement);
    } else {
      PaginationUpdateButtons.updateOnRowRemove(etc);
      PaginationUtils.updateRowsOnRemoval(etc, rowIndex);
    }
    PaginationActionButtonUtils.toggleActionButtons(etc.paginationInternal, etc.paginationInternal.buttonContainer);
    setTimeout(() => NumberOfVisibleRowsElement.update(etc));
  }

  public static initialRowUpdates(etc: EditableTableComponent, rowIndex: number, newRowElement: HTMLElement) {
    const dataRowIndex = etc.auxiliaryTableContentInternal.indexColumnCountStartsAtHeader ? rowIndex + 1 : rowIndex;
    if (dataRowIndex > etc.paginationInternal.numberOfRows) {
      newRowElement.style.visibility = PaginationUtils.COLLAPSED_ROW;
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
      (rowElement as HTMLElement).style.visibility = PaginationUtils.VISIBLE_ROW;
      visibleRows.push(rowElement as HTMLElement);
    });
  }

  private static hideAllRows(paginationInternal: PaginationInternal) {
    paginationInternal.visibleRows.forEach((rowElement) => {
      rowElement.style.visibility = PaginationUtils.COLLAPSED_ROW;
    });
    paginationInternal.visibleRows = [];
  }

  public static displayRowsForDifferentButton(etc: EditableTableComponent, buttonNumber: number) {
    PaginationUtils.hideAllRows(etc.paginationInternal);
    PaginationUtils.setCorrectRowsAsVisible(etc, buttonNumber);
    PaginationButtonElement.setActive(etc, etc.paginationInternal.buttonContainer, buttonNumber);
    NumberOfVisibleRowsElement.update(etc);
  }

  public static getDefaultInternal(): PaginationInternal {
    return {
      numberOfRows: 10,
      maxNumberOfButtons: 8,
      activeButtonNumber: 1,
      visibleRows: [],
      displayPrevNext: true,
      displayFirstLast: true,
      style: {}, // this is going to be populated during the call of processInternal method
      positions: {
        container: 'bottom-right',
      },
      displayNumberOfVisibleRows: true,
      displayNumberOfRowsOptions: [],
    } as unknown as PaginationInternal;
  }
}
