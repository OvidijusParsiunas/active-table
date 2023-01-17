import {ColumnDetailsUtils} from '../../../../utils/columnDetails/columnDetailsUtils';
import {CellWithTextEvents} from '../../../cell/cellsWithTextDiv/cellWithTextEvents';
import {SelectDropdownScrollbar} from '../selectDropdownScrollbar';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {CellElement} from '../../../cell/cellElement';
import {ActiveTable} from '../../../../activeTable';

export class SelectDeleteButtonEvents {
  private static delete(this: ActiveTable, columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {selectDropdown} = columnDetails;
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
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(columnDetails));
  }

  public static addEvents(at: ActiveTable, columnDetails: ColumnDetailsT, buttonElement: HTMLElement) {
    buttonElement.onclick = SelectDeleteButtonEvents.delete.bind(at, columnDetails);
  }
}
