import {FocusedCellUtils} from '../../../utils/focusedElements/focusedCellUtils';
import {EditableTableComponent} from '../../../editable-table-component';
import {KEYBOARD_KEY} from '../../../consts/keyboardKeys';
import {Browser} from '../../../utils/browser/browser';
import {CellEvents} from '../cellEvents';

export class CheckboxEvents {
  // REF-29
  // prettier-ignore
  private static focusCheckbox(this: EditableTableComponent,
    cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
  if (!Browser.IS_SAFARI) {
    const {focusedElements: {cell}, columnsDetails} = this;
    FocusedCellUtils.set(cell, cellElement, rowIndex, columnIndex, columnsDetails[columnIndex].types);
  }
}

  // REF-29
  private static blurCheckbox(this: EditableTableComponent) {
    if (!Browser.IS_SAFARI) FocusedCellUtils.purge(this.focusedElements.cell);
  }

  private static changeValueCheckbox(this: EditableTableComponent, rowIndex: number, columnIndex: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    CellEvents.updateCell(this, String(checkbox.checked), rowIndex, columnIndex, {processText: false});
  }

  private static keyDownCheckbox(event: KeyboardEvent) {
    if (event.key === KEYBOARD_KEY.ENTER) {
      const checkbox = event.target as HTMLInputElement;
      checkbox.click();
    }
  }

  // prettier-ignore
  public static setEvents(etc: EditableTableComponent,
      checkboxElement: HTMLInputElement, rowIndex: number, columnIndex: number) {
    checkboxElement.onkeydown = CheckboxEvents.keyDownCheckbox;
    checkboxElement.onchange = CheckboxEvents.changeValueCheckbox.bind(etc, rowIndex, columnIndex);
    checkboxElement.onfocus = CheckboxEvents.focusCheckbox.bind(etc, checkboxElement, rowIndex, columnIndex);
    checkboxElement.onblur = CheckboxEvents.blurCheckbox.bind(etc);
  }
}
