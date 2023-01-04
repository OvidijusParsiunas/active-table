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

  public static create(etc: EditableTableComponent) {
    const numberOfVisibleRowsElement = document.createElement('div');
    numberOfVisibleRowsElement.id = NumberOfVisibleRowsElement.ID;
    numberOfVisibleRowsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    Object.assign(numberOfVisibleRowsElement.style, etc.paginationInternal.style.numberOfVisibleRows);
    numberOfVisibleRowsElement.style.float = 'right';
    numberOfVisibleRowsElement.style.marginTop = '10px';
    numberOfVisibleRowsElement.style.marginRight = '10px';
    setTimeout(() => {
      NumberOfVisibleRowsElement.update(etc);
      etc.paginationInternal.buttonContainer.insertAdjacentElement('afterend', numberOfVisibleRowsElement);
    });
    return numberOfVisibleRowsElement;
  }
}
