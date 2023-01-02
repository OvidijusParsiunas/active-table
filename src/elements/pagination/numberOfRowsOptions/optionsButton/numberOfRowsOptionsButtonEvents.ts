import {EditableTableComponent} from '../../../../editable-table-component';
import {PaginationInternal} from '../../../../types/paginationInternal';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';
import {Dropdown} from '../../../dropdown/dropdown';

export class NumberOfRowsOptionsButtonEvents {
  private static buttonMouseDown(pagination: PaginationInternal) {
    pagination.mouseDownOnNumberOfRowsButton = true;
    setTimeout(() => (pagination.mouseDownOnNumberOfRowsButton = false));
  }

  private static buttonClick(this: EditableTableComponent, event: MouseEvent) {
    const dropdownElement = this.paginationInternal.numberOfRowsDropdown as HTMLElement;
    if (Dropdown.isDisplayed(dropdownElement)) {
      Dropdown.hide(dropdownElement);
    } else {
      const buttonElement = event.target as HTMLElement;
      NumberOfRowsDropdown.display(buttonElement, this.paginationInternal.numberOfRowsDropdown as HTMLElement);
    }
  }

  public static setEvents(etc: EditableTableComponent, optionsButton: HTMLElement) {
    optionsButton.onclick = NumberOfRowsOptionsButtonEvents.buttonClick.bind(etc);
    optionsButton.onmousedown = NumberOfRowsOptionsButtonEvents.buttonMouseDown.bind(this, etc.paginationInternal);
  }
}
