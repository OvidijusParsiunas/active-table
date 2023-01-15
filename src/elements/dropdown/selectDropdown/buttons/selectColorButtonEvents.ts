import {ColumnsDetailsT, DropdownOverlays} from '../../../../types/columnDetails';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {FocusedElements} from '../../../../types/focusedElements';
import {RGBAToHex} from '../../../../utils/color/rgbaToHex';
import {SelectButton} from './selectButton';

export class SelectColorButtonEvents {
  // important to note that mouse/key down events are not fired when clicked on picker
  public static windowEventClosePicker(columnsDetails: ColumnsDetailsT, focusedElements: FocusedElements) {
    if (focusedElements.selectDropdown) {
      const columnIndex = focusedElements.cell.columnIndex as number;
      const dropdown = columnsDetails[columnIndex].selectDropdown;
      SelectButton.hideAfterColorPickerContainerClose(dropdown.overlays);
    }
  }

  private static inputEvent(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    console.log(inputValue);
  }

  private static mouseDownContainer(overlays: DropdownOverlays, event: MouseEvent) {
    if (overlays.colorPickerContainer) {
      delete overlays.colorPickerContainer;
      return;
    }
    const buttonElement = event.target as HTMLElement;
    const containerElement = buttonElement.parentElement as HTMLElement;
    const dropdownItemElement = containerElement.parentElement as HTMLElement;
    const inputElement = buttonElement.previousSibling as PickerInputElement;
    inputElement.value = RGBAToHex.convert(dropdownItemElement.style.backgroundColor);
    inputElement.showPicker();
    setTimeout(() => (overlays.colorPickerContainer = containerElement));
  }

  public static setEvents(container: HTMLElement, colorInput: HTMLElement, overlays: DropdownOverlays) {
    container.onmousedown = SelectColorButtonEvents.mouseDownContainer.bind(this, overlays);
    colorInput.oninput = SelectColorButtonEvents.inputEvent;
  }
}
