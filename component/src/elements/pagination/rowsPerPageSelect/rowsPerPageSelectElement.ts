import {OuterContainerElements} from '../../../utils/outerTableComponents/outerContainerElements';
import {RowsPerPageSelectButtonElement} from './button/rowsPerPageSelectButtonElement';
import {PaginationInternal} from '../../../types/paginationInternal';
import {RowsPerPageDropdown} from './dropdown/rowsPerPageDropdown';
import {OuterContainers} from '../../../types/outerContainer';
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
  public static create(at: ActiveTable, containers: OuterContainers) {
    const rowsPerPageOptionsContainer = RowsPerPageSelectElement.createContainer(at._pagination);
    rowsPerPageOptionsContainer.appendChild(RowsPerPageSelectElement.createText(at._pagination));
    const optionsButton = RowsPerPageSelectButtonElement.create(at);
    rowsPerPageOptionsContainer.appendChild(optionsButton);
    at._pagination.rowsPerPageDropdown = RowsPerPageDropdown.create(at, optionsButton);
    rowsPerPageOptionsContainer.appendChild(at._pagination.rowsPerPageDropdown);
    OuterContainerElements.addToContainer(at._pagination.positions.rowsPerPageSelect.position,
      containers, rowsPerPageOptionsContainer);
    return rowsPerPageOptionsContainer;
  }
}
