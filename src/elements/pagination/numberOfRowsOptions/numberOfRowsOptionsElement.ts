import {EditableTableComponent} from '../../../editable-table-component';
import {PaginationElements} from '../paginationElements';

export class NumberOfRowsOptionsElement {
  private static readonly ID = 'pagination-of-rows-options';

  private static createOptionsArrowDiv() {
    const optionsText = document.createElement('div');
    optionsText.style.display = 'inline-block';
    optionsText.style.transform = 'translateY(-16%)';
    optionsText.style.marginLeft = '4px';
    optionsText.style.pointerEvents = 'none';
    optionsText.style.userSelect = 'none';
    optionsText.style.color = '#353535';
    optionsText.innerHTML = '&#8964';
    return optionsText;
  }

  private static createOptionsText() {
    const optionsText = document.createElement('div');
    optionsText.style.display = 'inline-block';
    optionsText.style.pointerEvents = 'none';
    optionsText.style.userSelect = 'none';
    optionsText.innerHTML = '2';
    return optionsText;
  }

  private static createOptionsButton() {
    const optionsButton = document.createElement('div');
    optionsButton.style.border = '1px solid grey';
    optionsButton.style.borderRadius = '5px';
    optionsButton.style.display = 'inline-block';
    optionsButton.style.padding = '0px 5px';
    optionsButton.style.cursor = 'pointer';
    const number = NumberOfRowsOptionsElement.createOptionsText();
    optionsButton.appendChild(number);
    const arrow = NumberOfRowsOptionsElement.createOptionsArrowDiv();
    optionsButton.appendChild(arrow);
    return optionsButton;
  }

  private static createText() {
    const textElement = document.createElement('div');
    textElement.style.marginRight = '8px';
    textElement.style.display = 'inline-block';
    textElement.innerText = 'Rows per page';
    return textElement;
  }

  private static createContainer() {
    const numberOfRowsOptionsElement = document.createElement('div');
    numberOfRowsOptionsElement.id = NumberOfRowsOptionsElement.ID;
    numberOfRowsOptionsElement.classList.add(PaginationElements.PAGINATION_TEXT_COMPONENT_CLASS);
    numberOfRowsOptionsElement.style.float = 'right';
    numberOfRowsOptionsElement.style.marginTop = '8px';
    numberOfRowsOptionsElement.style.marginRight = '10px';
    return numberOfRowsOptionsElement;
  }

  public static create(etc: EditableTableComponent) {
    const numberOfRowsOptionsContainer = NumberOfRowsOptionsElement.createContainer();
    const textElement = NumberOfRowsOptionsElement.createText();
    numberOfRowsOptionsContainer.appendChild(textElement);
    const optionsButton = NumberOfRowsOptionsElement.createOptionsButton();
    numberOfRowsOptionsContainer.appendChild(optionsButton);
    setTimeout(() => {
      etc.paginationInternal.buttonContainer.insertAdjacentElement('afterend', numberOfRowsOptionsContainer);
    });
    return numberOfRowsOptionsContainer;
  }
}
