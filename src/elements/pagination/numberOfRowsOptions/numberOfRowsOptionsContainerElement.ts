import {NumberOfRowsOptionsElement} from './optionsButton/numberOfRowsOptionsElement';
import {NumberOfRowsDropdown} from './optionsButton/numberOfRowsDropdown';
import {EditableTableComponent} from '../../../editable-table-component';
import {PaginationElements} from '../paginationElements';

export class NumberOfRowsOptionsContainerElement {
  private static readonly ID = 'pagination-of-rows-options';
  private static readonly TEXT_ID = 'pagination-of-rows-options-text';

  private static createText() {
    const textElement = document.createElement('div');
    textElement.id = NumberOfRowsOptionsContainerElement.TEXT_ID;
    textElement.style.marginRight = '8px';
    textElement.innerText = 'Rows per page:';
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
    numberOfRowsOptionsContainer.appendChild(NumberOfRowsOptionsContainerElement.createText());
    const optionsButton = NumberOfRowsOptionsElement.create(etc);
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
