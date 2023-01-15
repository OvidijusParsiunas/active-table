import {ColumnDetailsT, ColumnsDetailsT, DropdownOverlays, SelectDropdownT} from '../../../../types/columnDetails';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {FocusedElements} from '../../../../types/focusedElements';
import {RGBAToHex} from '../../../../utils/color/rgbaToHex';
import {SelectColorButton} from './selectColorButton';
import {SelectButton} from './selectButton';

export class SelectColorButtonEvents {
  public static updateColumnLabelColors(overlays: DropdownOverlays, cellElements: HTMLElement[]) {
    if (!overlays.colorPickerNewValue) return;
    cellElements.forEach((cellElement) => {
      const textElement = cellElement.children[0] as HTMLElement;
      if (textElement.innerText === overlays.colorPickerNewValue?.text) {
        textElement.style.backgroundColor = overlays.colorPickerNewValue.color;
      }
    });
    delete overlays.colorPickerNewValue;
  }

  // important to note that mouse/key down events are not fired when clicked on picker
  public static windowEventClosePicker(columnsDetails: ColumnsDetailsT, focusedElements: FocusedElements) {
    if (focusedElements.selectDropdown) {
      const columnIndex = focusedElements.cell.columnIndex as number;
      SelectButton.hideAfterColorPickerContainerClose(columnsDetails[columnIndex]);
    }
  }

  private static inputEvent(dropdown: SelectDropdownT, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const {textElement, dropdownItemElement} = SelectColorButton.extractRelativeParentElements(inputElement);
    const text = textElement.textContent as string;
    const color = inputElement.value;
    dropdownItemElement.style.backgroundColor = color;
    const selectItemDetails = dropdown.selectItem[text];
    if (selectItemDetails.color !== color) {
      selectItemDetails.color = color;
      dropdown.overlays.colorPickerNewValue = {color, text};
    }
  }

  // prettier-ignore
  private static mouseDownContainer(columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {selectDropdown: {overlays}, elements} = columnDetails;
    if (overlays.colorPickerContainer) {
      delete overlays.colorPickerContainer;
      SelectColorButtonEvents.updateColumnLabelColors(overlays, elements);
      return;
    }
    const buttonElement = event.target as HTMLElement;
    const {containerElement, dropdownItemElement} = SelectColorButton.extractRelativeParentElements(buttonElement);
    const inputElement = buttonElement.previousSibling as PickerInputElement;
    inputElement.value = RGBAToHex.convert(dropdownItemElement.style.backgroundColor);
    inputElement.showPicker();
    setTimeout(() => (overlays.colorPickerContainer = containerElement));
  }

  public static setEvents(container: HTMLElement, colorInput: HTMLElement, columnDetails: ColumnDetailsT) {
    container.onmousedown = SelectColorButtonEvents.mouseDownContainer.bind(this, columnDetails);
    colorInput.oninput = SelectColorButtonEvents.inputEvent.bind(this, columnDetails.selectDropdown);
  }
}
