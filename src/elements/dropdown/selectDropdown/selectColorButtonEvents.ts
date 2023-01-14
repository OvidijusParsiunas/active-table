import {ColumnsDetailsT, DropdownOverlays} from '../../../types/columnDetails';
import {PickerInputElement} from '../../../types/pickerInputElement';
import {FocusedElements} from '../../../types/focusedElements';

export class SelectColorButtonEvents {
  public static windowEventClosePicker(columnsDetails: ColumnsDetailsT, focusedElements: FocusedElements) {
    if (focusedElements.selectDropdown) {
      const columnIndex = focusedElements.cell.columnIndex as number;
      const dropdown = columnsDetails[columnIndex].selectDropdown;
      if (dropdown.overlays.colorPickerInput) {
        // mouse/key down events are not fired when clicked on picker
        delete dropdown.overlays.colorPickerInput;
      }
    }
  }

  private static inputEvent(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    console.log(inputValue);
  }

  private static mouseDownContainer(overlays: DropdownOverlays, event: MouseEvent) {
    if (overlays.colorPickerInput) return;
    const inputElement = (event.target as HTMLElement).previousSibling as PickerInputElement;
    inputElement.showPicker();
    setTimeout(() => (overlays.colorPickerInput = inputElement));
  }

  public static setEvents(container: HTMLElement, colorInput: HTMLElement, overlays: DropdownOverlays) {
    container.onmousedown = SelectColorButtonEvents.mouseDownContainer.bind(this, overlays);
    colorInput.oninput = SelectColorButtonEvents.inputEvent;
  }
}
