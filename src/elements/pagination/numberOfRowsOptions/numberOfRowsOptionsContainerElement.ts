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
    textElement.innerText = (pagination.numberOfRowsOptions as NumberOfRowsOptions).prefixText as string;
    return textElement;
  }

  private static createContainer() {
    const numberOfRowsOptionsElement = document.createElement('div');
    numberOfRowsOptionsElement.id = NumberOfRowsOptionsContainerElement.ID;
    numberOfRowsOptionsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    numberOfRowsOptionsElement.style.marginTop = '8px';
    numberOfRowsOptionsElement.style.marginRight = '10px';
    return numberOfRowsOptionsElement;
  }

  public static create(etc: EditableTableComponent) {
    const numberOfRowsOptionsContainer = NumberOfRowsOptionsContainerElement.createContainer();
    numberOfRowsOptionsContainer.appendChild(NumberOfRowsOptionsContainerElement.createText(etc.paginationInternal));
    const optionsButton = NumberOfRowsOptionsButtonElement.create(etc);
    numberOfRowsOptionsContainer.appendChild(optionsButton);
    etc.paginationInternal.numberOfRowsDropdown = NumberOfRowsDropdown.create(etc, optionsButton);
    numberOfRowsOptionsContainer.appendChild(etc.paginationInternal.numberOfRowsDropdown);
    setTimeout(() => {
      // wait for the buttonContainer to be added into dom
      etc.paginationInternal.buttonContainer.insertAdjacentElement('afterend', numberOfRowsOptionsContainer);
    });
    return numberOfRowsOptionsContainer;
  }
}
