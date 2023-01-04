import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {EditableTableComponent} from '../../../editable-table-component';
import {PaginationInternal} from '../../../types/paginationInternal';
import {PaginationElements} from '../paginationElements';

export class NumberOfVisibleRowsElement {
  private static readonly ID = 'pagination-number-of-visible-rows';

  private static updateForRelativeRowNumber(pagination: PaginationInternal, dataRowsLength: number) {
    const {activePageNumber, numberOfRows, numberOfVisibleRowsElement} = pagination as Required<PaginationInternal>;
    const maxRowIndex = activePageNumber * numberOfRows;
    const minVisibleRowIndex = dataRowsLength < 1 ? 0 : Math.max(maxRowIndex - numberOfRows + 1, 1);
    const maxVisibleRowIndex = Math.min(dataRowsLength, maxRowIndex);
    numberOfVisibleRowsElement.innerText = `${minVisibleRowIndex}-${maxVisibleRowIndex} of ${dataRowsLength}`;
  }

  private static updateForAllRows(numberOfVisibleRowsElement: HTMLElement, dataRowsLength: number) {
    numberOfVisibleRowsElement.innerText = `${Math.min(dataRowsLength, 1)}-${dataRowsLength} of ${dataRowsLength}`;
  }

  // prettier-ignore
  public static update(etc: EditableTableComponent) {
    const {paginationInternal, contents, auxiliaryTableContentInternal: {indexColumnCountStartsAtHeader}} = etc;
    const {numberOfVisibleRowsElement, isAllRowsOptionSelected} = paginationInternal;
    if (!numberOfVisibleRowsElement) return;
    const dataRowsLength = indexColumnCountStartsAtHeader ? contents.length : contents.length - 1;
    if (isAllRowsOptionSelected) {
      NumberOfVisibleRowsElement.updateForAllRows(numberOfVisibleRowsElement, dataRowsLength);
    } else {
      NumberOfVisibleRowsElement.updateForRelativeRowNumber(etc.paginationInternal, dataRowsLength);
    }
  }

  public static create(etc: EditableTableComponent, containers: Containers) {
    const numberOfVisibleRowsElement = document.createElement('div');
    numberOfVisibleRowsElement.id = NumberOfVisibleRowsElement.ID;
    numberOfVisibleRowsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    const {style, positions} = etc.paginationInternal;
    numberOfVisibleRowsElement.style.order = String(positions.numberOfVisibleRows.order);
    Object.assign(numberOfVisibleRowsElement.style, style.numberOfVisibleRows);
    PaginationContainerElement.addToContainer(positions.numberOfVisibleRows.side, containers, numberOfVisibleRowsElement);
    setTimeout(() => NumberOfVisibleRowsElement.update(etc));
    return numberOfVisibleRowsElement;
  }
}
