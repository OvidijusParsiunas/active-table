import {CellWithTextEvents} from '../../../cell/cellsWithTextDiv/cellWithTextEvents';
import {SelectDropdownScrollbar} from '../selectDropdownScrollbar';
import {SelectDropdownT} from '../../../../types/columnDetails';
import {CellElement} from '../../../cell/cellElement';
import {ActiveTable} from '../../../../activeTable';

export class SelectDeleteButtonEvents {
  private static delete(this: ActiveTable, selectDropdown: SelectDropdownT, event: MouseEvent) {
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete selectDropdown.selectItems[CellElement.getText(itemElement.children[0] as HTMLElement)];
    itemElement.remove();
    if (Object.keys(selectDropdown.selectItems).length === 0) {
      CellWithTextEvents.programmaticBlur(this);
    } else {
      SelectDropdownScrollbar.setProperties(selectDropdown);
    }
  }

  public static addEvents(at: ActiveTable, selectDropdown: SelectDropdownT, buttonElement: HTMLElement) {
    buttonElement.onclick = SelectDeleteButtonEvents.delete.bind(at, selectDropdown);
  }
}
