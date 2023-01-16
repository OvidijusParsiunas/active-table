import {Containers, PaginationContainerElement} from '../paginationContainer/paginationContainerElement';
import {NumberOfRowsOptionsButtonElement} from './optionsButton/numberOfRowsOptionsButtonElement';
import {NumberOfRowsDropdown} from './optionsButton/numberOfRowsDropdown';
import {EditableTableComponent} from '../../../editable-table-component';
import {PaginationInternal} from '../../../types/paginationInternal';
import {NumberOfRowsOptions} from '../../../types/pagination';
import {PaginationElements} from '../paginationElements';

export class NumberOfRowsOptionsContainerElement {
  private static readonly ID = 'pagination-of-rows-options';
  private static readonly TEXT_ID = 'pagination-of-rows-options-text';

  private static createText(pagination: PaginationInternal) {
    const textElement = document.createElement('div');
    textElement.id = NumberOfRowsOptionsContainerElement.TEXT_ID;
    textElement.style.marginRight = '8px';
    Object.assign(textElement.style, pagination.style.numberOfRowsOptions?.prefixText);
    textElement.innerText = (pagination.numberOfRowsOptions as NumberOfRowsOptions).prefixText as string;
    return textElement;
  }

  private static createContainer(pagination: PaginationInternal) {
    const numberOfRowsOptionsElement = document.createElement('div');
    numberOfRowsOptionsElement.id = NumberOfRowsOptionsContainerElement.ID;
    numberOfRowsOptionsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    numberOfRowsOptionsElement.style.order = String(pagination.positions.numberOfRowsOptions.order);
    Object.assign(numberOfRowsOptionsElement.style, pagination.style.numberOfRowsOptions?.container);
    return numberOfRowsOptionsElement;
  }

  // prettier-ignore
  public static create(etc: EditableTableComponent, containers: Containers) {
    const numberOfRowsOptionsContainer = NumberOfRowsOptionsContainerElement.createContainer(etc.paginationInternal);
    numberOfRowsOptionsContainer.appendChild(NumberOfRowsOptionsContainerElement.createText(etc.paginationInternal));
    const optionsButton = NumberOfRowsOptionsButtonElement.create(etc);
    numberOfRowsOptionsContainer.appendChild(optionsButton);
    etc.paginationInternal.numberOfRowsDropdown = NumberOfRowsDropdown.create(etc, optionsButton);
    numberOfRowsOptionsContainer.appendChild(etc.paginationInternal.numberOfRowsDropdown);
    PaginationContainerElement.addToContainer(etc.paginationInternal.positions.numberOfRowsOptions.side,
      containers, numberOfRowsOptionsContainer);
    return numberOfRowsOptionsContainer;
  }
}
