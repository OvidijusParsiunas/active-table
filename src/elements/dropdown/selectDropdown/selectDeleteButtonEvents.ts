import {CellWithTextEvents} from '../../cell/cellsWithTextDiv/cellWithTextEvents';
import {EditableTableComponent} from '../../../editable-table-component';
import {SelectDropdownScrollbar} from './selectDropdownScrollbar';
import {SelectDropdownT} from '../../../types/columnDetails';
import {CellElement} from '../../cell/cellElement';

export class SelectDeleteButtonEvents {
  private static delete(this: EditableTableComponent, selectDropdown: SelectDropdownT, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete selectDropdown.selectItem[CellElement.getText(itemElement.children[0] as HTMLElement)];
    itemElement.remove();
    if (Object.keys(selectDropdown.selectItem).length === 0) {
      CellWithTextEvents.programmaticBlur(this);
    } else {
      SelectDropdownScrollbar.setProperties(selectDropdown);
    }
  }

  public static addEvents(etc: EditableTableComponent, selectDropdown: SelectDropdownT, buttonElement: HTMLElement) {
    buttonElement.onclick = SelectDeleteButtonEvents.delete.bind(etc, selectDropdown);
  }
}
