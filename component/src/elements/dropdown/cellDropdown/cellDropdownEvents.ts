import {CellWithTextEvents} from '../../cell/cellsWithTextDiv/cellWithTextEvents';
import {FocusedElements} from '../../../types/focusedElements';
import {CellDetails} from '../../../types/focusedCell';
import {CellDropdownItem} from './cellDropdownItem';
import {OptionButton} from './buttons/optionButton';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

export class CellDropdownEvents {
  // instead of binding click event handlers with the context of current row index to individual item elements every
  // time the dropdown is displayed, click events are handled on the dropdown instead, the reason for this is
  // because it can be expensive to rebind an arbitrary amount of items e.g. 10000+
  // prettier-ignore
  private static click(this: ActiveTable, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    // target is dropdown when clicked on top/bottom paddding
    if (targetElement.classList.contains(Dropdown.DROPDOWN_CLASS)
      || targetElement.classList.contains(OptionButton.BUTTON_CLASS)) return;
    const {rowIndex, columnIndex, element: cellElement} = this.focusedElements.cell as CellDetails;
    const itemElement = targetElement.classList.contains(DropdownItem.DROPDOWN_ITEM_CLASS)
      ? targetElement : targetElement.parentElement;
    CellDropdownItem.selectExistingItem(this, itemElement as HTMLElement, rowIndex, columnIndex,
      cellElement.children[0] as HTMLElement);
    CellWithTextEvents.programmaticBlur(this);
  }

  // this is required to record to stop cell blur from closing the dropdown
  // additionally if the user clicks on dropdown scroll or padding, this will record it
  private static mouseDown(focusedElements: FocusedElements, dropdownElement: HTMLElement) {
    focusedElements.cellDropdown = dropdownElement;
  }

  public static set(at: ActiveTable, dropdownElement: HTMLElement) {
    dropdownElement.onmousedown = CellDropdownEvents.mouseDown.bind(this, at.focusedElements, dropdownElement);
    dropdownElement.onclick = CellDropdownEvents.click.bind(at);
  }
}
