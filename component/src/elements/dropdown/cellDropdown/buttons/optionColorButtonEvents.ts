import {CellDropdownI, LabelDetails} from '../../../../types/cellDropdownInternal';
import {ColumnDetailsT, ColumnsDetailsT} from '../../../../types/columnDetails';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {FocusedElements} from '../../../../types/focusedElements';
import {RGBAToHex} from '../../../../utils/color/rgbaToHex';
import {OptionColorButton} from './optionColorButton';
import {OptionButton} from './optionButton';

export class OptionColorButtonEvents {
  // prettier-ignore
  public static updateColumnLabelColors(columnDetails: ColumnDetailsT, cellElements: HTMLElement[]) {
    const {cellDropdown: {labelDetails}} = columnDetails;
    if (!labelDetails || !labelDetails.colorPickerNewValue) return;
    cellElements.forEach((cellElement) => {
      const textElement = cellElement.children[0] as HTMLElement;
      if (textElement.innerText === labelDetails.colorPickerNewValue?.itemText) {
        textElement.style.backgroundColor = labelDetails.colorPickerNewValue.backgroundColor;
      }
    });
    setTimeout(() => columnDetails.fireColumnUpdate());
    delete labelDetails.colorPickerNewValue;
  }

  // important to note that mouse/key down events are not fired when clicked on picker
  public static windowEventClosePicker(columnsDetails: ColumnsDetailsT, focusedElements: FocusedElements) {
    if (focusedElements.cellDropdown) {
      const columnIndex = focusedElements.cell.columnIndex as number;
      OptionButton.hideAfterColorPickerContainerClose(columnsDetails[columnIndex]);
    }
  }

  private static inputEvent(dropdown: CellDropdownI, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const {textElement, dropdownItemElement} = OptionColorButton.extractRelativeParentElements(inputElement);
    const itemText = textElement.textContent as string;
    const backgroundColor = inputElement.value;
    dropdownItemElement.style.backgroundColor = backgroundColor;
    const itemDetails = dropdown.itemsDetails[itemText];
    if (itemDetails.backgroundColor !== backgroundColor) {
      itemDetails.backgroundColor = backgroundColor;
      (dropdown.labelDetails as LabelDetails).colorPickerNewValue = {backgroundColor, itemText};
    }
  }

  // prettier-ignore
  private static mouseDownContainer(columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {cellDropdown: {labelDetails}, elements} = columnDetails;
    if (!labelDetails) return;
    if (labelDetails.colorPickerContainer) {
      delete labelDetails.colorPickerContainer;
      OptionColorButtonEvents.updateColumnLabelColors(columnDetails, elements);
      return;
    }
    const buttonElement = event.target as HTMLElement;
    const {containerElement, dropdownItemElement} = OptionColorButton.extractRelativeParentElements(buttonElement);
    const inputElement = buttonElement.previousSibling as PickerInputElement;
    inputElement.value = RGBAToHex.convert(dropdownItemElement.style.backgroundColor);
    inputElement.showPicker();
    setTimeout(() => (labelDetails.colorPickerContainer = containerElement));
  }

  public static setEvents(container: HTMLElement, colorInput: HTMLElement, columnDetails: ColumnDetailsT) {
    container.onmousedown = OptionColorButtonEvents.mouseDownContainer.bind(this, columnDetails);
    colorInput.oninput = OptionColorButtonEvents.inputEvent.bind(this, columnDetails.cellDropdown);
  }
}
