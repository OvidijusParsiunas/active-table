import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {RowsPerPageSelectButtonElement} from './button/rowsPerPageSelectButtonElement';
import {RowsPerPageDropdown} from './dropdown/rowsPerPageDropdown';
import {PaginationInternal} from '../../../types/paginationInternal';
import {RowsPerPageSelect} from '../../../types/pagination';
import {PaginationElements} from '../paginationElements';
import {ActiveTable} from '../../../activeTable';

export class RowsPerPageSelectElement {
  private static readonly ID = 'pagination-number-of-rows-select';
  private static readonly TEXT_ID = 'pagination-number-of-rows-select-text';

  private static createText(pagination: PaginationInternal) {
    const textElement = document.createElement('div');
    textElement.id = RowsPerPageSelectElement.TEXT_ID;
    textElement.style.marginRight = '8px';
    Object.assign(textElement.style, pagination.style.rowsPerPageSelect?.prefixText);
    textElement.innerText = (pagination.rowsPerPageSelect as RowsPerPageSelect).prefixText as string;
    return textElement;
  }

  private static createContainer(pagination: PaginationInternal) {
    const rowsPerPageOptionsElement = document.createElement('div');
    rowsPerPageOptionsElement.id = RowsPerPageSelectElement.ID;
    rowsPerPageOptionsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    rowsPerPageOptionsElement.style.order = String(pagination.positions.rowsPerPageSelect.order);
    Object.assign(rowsPerPageOptionsElement.style, pagination.style.rowsPerPageSelect?.container);
    return rowsPerPageOptionsElement;
  }

  // prettier-ignore
  public static create(at: ActiveTable, containers: Containers) {
    const rowsPerPageOptionsContainer = RowsPerPageSelectElement.createContainer(at.paginationInternal);
    rowsPerPageOptionsContainer.appendChild(RowsPerPageSelectElement.createText(at.paginationInternal));
    const optionsButton = RowsPerPageSelectButtonElement.create(at);
    rowsPerPageOptionsContainer.appendChild(optionsButton);
    at.paginationInternal.rowsPerPageDropdown = RowsPerPageDropdown.create(at, optionsButton);
    rowsPerPageOptionsContainer.appendChild(at.paginationInternal.rowsPerPageDropdown);
    PaginationContainerElement.addToContainer(at.paginationInternal.positions.rowsPerPageSelect.side,
      containers, rowsPerPageOptionsContainer);
    return rowsPerPageOptionsContainer;
  }
}