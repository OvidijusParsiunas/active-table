import {EditableTableComponent} from '../../../../editable-table-component';
import {NumberOfRowsDropdown} from './numberOfRowsDropdown';

export class NumberOfRowsOptionsEvents {
  private static buttonClick(this: EditableTableComponent, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    NumberOfRowsDropdown.display(buttonElement, this.paginationInternal.numberOfRowsDropdown as HTMLElement);
  }

  public static setEvents(etc: EditableTableComponent, optionsButton: HTMLElement) {
    optionsButton.onclick = NumberOfRowsOptionsEvents.buttonClick.bind(etc);
  }
}
