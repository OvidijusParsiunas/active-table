import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {PaginationInternal} from '../../../types/paginationInternal';
import {OuterContainers} from '../../../types/outerContainer';
import {PaginationElements} from '../paginationElements';
import {ActiveTable} from '../../../activeTable';

export class NumberOfVisibleRowsElement {
  private static readonly ID = 'pagination-number-of-visible-rows';

  private static updateForRelativeRowNumber(pagination: PaginationInternal, dataRowsLength: number) {
    const {activePageNumber, rowsPerPage, numberOfVisibleRowsElement} = pagination as Required<PaginationInternal>;
    const maxRowIndex = activePageNumber * rowsPerPage;
    const minVisibleRowIndex = dataRowsLength < 1 ? 0 : Math.max(maxRowIndex - rowsPerPage + 1, 1);
    const maxVisibleRowIndex = Math.min(dataRowsLength, maxRowIndex);
    numberOfVisibleRowsElement.innerText = `${minVisibleRowIndex}-${maxVisibleRowIndex} of ${dataRowsLength}`;
  }

  private static updateForAllRows(numberOfVisibleRowsElement: HTMLElement, dataRowsLength: number) {
    numberOfVisibleRowsElement.innerText = `${Math.min(dataRowsLength, 1)}-${dataRowsLength} of ${dataRowsLength}`;
  }

  public static update(at: ActiveTable) {
    const {_pagination, content, dataStartsAtHeader} = at;
    const {numberOfVisibleRowsElement, isAllRowsOptionSelected} = _pagination;
    if (!numberOfVisibleRowsElement) return;
    // using max as when there are no contents on startup - dataRowsLength is -1
    const dataRowsLength = Math.max(dataStartsAtHeader ? content.length : content.length - 1, 0);
    if (isAllRowsOptionSelected) {
      NumberOfVisibleRowsElement.updateForAllRows(numberOfVisibleRowsElement, dataRowsLength);
    } else {
      NumberOfVisibleRowsElement.updateForRelativeRowNumber(at._pagination, dataRowsLength);
    }
  }

  public static create(at: ActiveTable, containers: OuterContainers) {
    const numberOfVisibleRowsElement = document.createElement('div');
    numberOfVisibleRowsElement.id = NumberOfVisibleRowsElement.ID;
    numberOfVisibleRowsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    const {style, positions} = at._pagination;
    numberOfVisibleRowsElement.style.order = String(positions.numberOfVisibleRows.order);
    Object.assign(numberOfVisibleRowsElement.style, style.numberOfVisibleRows);
    OuterContainerElements.addToContainer(positions.numberOfVisibleRows.side, containers, numberOfVisibleRowsElement);
    setTimeout(() => NumberOfVisibleRowsElement.update(at));
    return numberOfVisibleRowsElement;
  }
}
