import {ColumnDetailsUtils} from '../../../../utils/columnDetails/columnDetailsUtils';
import {CellWithTextEvents} from '../../../cell/cellsWithTextDiv/cellWithTextEvents';
import {CellDropdownScrollbar} from '../cellDropdownScrollbar';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {CellElement} from '../../../cell/cellElement';
import {ActiveTable} from '../../../../activeTable';

export class OptionDeleteButtonEvents {
  private static delete(this: ActiveTable, columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {cellDropdown} = columnDetails;
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const itemElement = containerElement.parentElement as HTMLElement;
    delete cellDropdown.itemsDetails[CellElement.getText(itemElement.children[0] as HTMLElement)];
    itemElement.remove();
    if (Object.keys(cellDropdown.itemsDetails).length === 0) {
      CellWithTextEvents.programmaticBlur(this);
    } else {
      CellDropdownScrollbar.setProperties(cellDropdown);
    }
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(this._columnsDetails, this.onColumnsUpdate));
  }

  public static addEvents(at: ActiveTable, columnDetails: ColumnDetailsT, buttonElement: HTMLElement) {
    buttonElement.onclick = OptionDeleteButtonEvents.delete.bind(at, columnDetails);
  }
}
