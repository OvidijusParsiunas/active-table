import {NumberOfRowsOptionsButtonElement} from './numberOfRowsOptionsButtonElement';
import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {PaginationStyle} from '../../../../types/pagination';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';
import {StatefulCSSS} from '../../../../types/cssStyle';
import {Dropdown} from '../../../dropdown/dropdown';

export class NumberOfRowsOptionsButtonEvents {
  private static buttonClick(this: EditableTableComponent, event: MouseEvent) {
    const dropdownElement = this.paginationInternal.numberOfRowsDropdown as HTMLElement;
    if (Dropdown.isDisplayed(dropdownElement)) {
      Dropdown.hide(dropdownElement);
    } else {
      const buttonElement = event.target as HTMLElement;
      NumberOfRowsDropdown.display(buttonElement, this.paginationInternal.numberOfRowsDropdown as HTMLElement);
    }
  }

  private static buttonMouseDown(pagination: PaginationInternal, event: MouseEvent) {
    const button = event.target as HTMLElement;
    Object.assign(button.style, pagination.style.numberOfRowsOptions?.button?.click);
    const buttonText = button.children[0] as HTMLElement;
    Object.assign(buttonText.style, pagination.style.numberOfRowsOptions?.buttonText?.click);
    const buttonArrow = button.children[1] as HTMLElement;
    Object.assign(buttonArrow.style, pagination.style.numberOfRowsOptions?.buttonArrow?.click);
    pagination.mouseDownOnNumberOfRowsButton = true;
    setTimeout(() => (pagination.mouseDownOnNumberOfRowsButton = false));
  }

  private static buttonMouseLeave(paginationStyle: PaginationStyle<Required<StatefulCSSS>>, event: MouseEvent) {
    const button = event.target as HTMLElement;
    NumberOfRowsOptionsButtonElement.reapplyStylesOnElements(button, 'default', paginationStyle.numberOfRowsOptions);
  }

  private static buttonMouseEnter(paginationStyle: PaginationStyle<Required<StatefulCSSS>>, event: MouseEvent) {
    const button = event.target as HTMLElement;
    NumberOfRowsOptionsButtonElement.reapplyStylesOnElements(button, 'hover', paginationStyle.numberOfRowsOptions);
  }

  public static setEvents(etc: EditableTableComponent, optionsButton: HTMLElement) {
    optionsButton.onmouseenter = NumberOfRowsOptionsButtonEvents.buttonMouseEnter.bind(this, etc.paginationInternal.style);
    optionsButton.onmouseleave = NumberOfRowsOptionsButtonEvents.buttonMouseLeave.bind(this, etc.paginationInternal.style);
    optionsButton.onmousedown = NumberOfRowsOptionsButtonEvents.buttonMouseDown.bind(this, etc.paginationInternal);
    optionsButton.onmouseup = NumberOfRowsOptionsButtonEvents.buttonMouseEnter.bind(this, etc.paginationInternal.style);
    optionsButton.onclick = NumberOfRowsOptionsButtonEvents.buttonClick.bind(etc);
  }
}
