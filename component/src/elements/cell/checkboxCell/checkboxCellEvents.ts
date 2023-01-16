import {CheckboxCellElement} from './checkboxCellElement';
import {ActiveTable} from '../../../activeTable';
import {CheckboxEvents} from './checkboxEvents';
import {CellElement} from '../cellElement';

export class CheckboxCellEvents {
  private static mouseDownCell(this: ActiveTable, event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains(CellElement.CELL_CLASS)) {
      const checkboxElement = target.children[0] as HTMLInputElement;
      checkboxElement.click();
    }
  }

  // REF-29
  private static focusCell(event: FocusEvent) {
    // this is triggered in firefox
    const target = event.target as HTMLElement;
    const checkboxElement = target.children[0] as HTMLInputElement;
    checkboxElement.focus();
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!at.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = CheckboxCellEvents.focusCell;
    // these are used in date cells and overwritten when converted from
    cellElement.onmouseenter = () => {};
    cellElement.onmouseleave = () => {};
    cellElement.oninput = () => {};
    cellElement.onmousedown = CheckboxCellEvents.mouseDownCell.bind(at);
    const checkboxElement = CheckboxCellElement.getCheckboxElement(cellElement) as HTMLInputElement;
    CheckboxEvents.setEvents(at, checkboxElement, rowIndex, columnIndex);
  }
}
