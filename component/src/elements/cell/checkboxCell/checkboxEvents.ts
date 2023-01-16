import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {Browser} from '../../../utils/browser/browser';
import {ActiveTable} from '../../../activeTable';
import {CellEvents} from '../cellEvents';

export class CheckboxEvents {
  // REF-29
  // prettier-ignore
  private static focusCheckbox(this: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
  if (!Browser.IS_SAFARI) {
    const {focusedElements: {cell}, columnsDetails} = this;
    FocusedCellUtils.set(cell, cellElement, rowIndex, columnIndex, columnsDetails[columnIndex].types);
  }
}

  // REF-29
  private static blurCheckbox(this: ActiveTable) {
    if (!Browser.IS_SAFARI) FocusedCellUtils.purge(this.focusedElements.cell);
  }

  private static changeValueCheckbox(this: ActiveTable, rowIndex: number, columnIndex: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    CellEvents.updateCell(this, String(checkbox.checked), rowIndex, columnIndex, {processText: false});
  }

  private static keyDownCheckbox(event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const checkbox = event.target as HTMLInputElement;
      checkbox.click();
    }
  }

  public static setEvents(at: ActiveTable, checkboxElement: HTMLInputElement, rowIndex: number, columnIndex: number) {
    checkboxElement.onkeydown = CheckboxEvents.keyDownCheckbox;
    checkboxElement.onchange = CheckboxEvents.changeValueCheckbox.bind(at, rowIndex, columnIndex);
    checkboxElement.onfocus = CheckboxEvents.focusCheckbox.bind(at, checkboxElement, rowIndex, columnIndex);
    checkboxElement.onblur = CheckboxEvents.blurCheckbox.bind(at);
  }
}
