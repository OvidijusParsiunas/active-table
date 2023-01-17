import {ColumnDetailsT, ColumnsDetailsT, LabelDetails, SelectDropdownT} from '../../../../types/columnDetails';
import {ColumnDetailsUtils} from '../../../../utils/columnDetails/columnDetailsUtils';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {FocusedElements} from '../../../../types/focusedElements';
import {RGBAToHex} from '../../../../utils/color/rgbaToHex';
import {SelectColorButton} from './selectColorButton';
import {SelectButton} from './selectButton';

export class SelectColorButtonEvents {
  // prettier-ignore
  public static updateColumnLabelColors(columnDetails: ColumnDetailsT, cellElements: HTMLElement[]) {
    const {selectDropdown: {labelDetails}} = columnDetails;
    if (!labelDetails || !labelDetails.colorPickerNewValue) return;
    cellElements.forEach((cellElement) => {
      const textElement = cellElement.children[0] as HTMLElement;
      if (textElement.innerText === labelDetails.colorPickerNewValue?.itemText) {
        textElement.style.backgroundColor = labelDetails.colorPickerNewValue.backgroundColor;
      }
    });
    setTimeout(() => ColumnDetailsUtils.fireUpdateEvent(columnDetails));
    delete labelDetails.colorPickerNewValue;
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
    const itemText = textElement.textContent as string;
    const backgroundColor = inputElement.value;
    dropdownItemElement.style.backgroundColor = backgroundColor;
    const selectItemDetails = dropdown.itemsDetails[itemText];
    if (selectItemDetails.backgroundColor !== backgroundColor) {
      selectItemDetails.backgroundColor = backgroundColor;
      (dropdown.labelDetails as LabelDetails).colorPickerNewValue = {backgroundColor, itemText};
    }
  }

  // prettier-ignore
  private static mouseDownContainer(columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {selectDropdown: {labelDetails}, elements} = columnDetails;
    if (!labelDetails) return;
    if (labelDetails.colorPickerContainer) {
      delete labelDetails.colorPickerContainer;
      SelectColorButtonEvents.updateColumnLabelColors(columnDetails, elements);
      return;
    }
    const buttonElement = event.target as HTMLElement;
    const {containerElement, dropdownItemElement} = SelectColorButton.extractRelativeParentElements(buttonElement);
    const inputElement = buttonElement.previousSibling as PickerInputElement;
    inputElement.value = RGBAToHex.convert(dropdownItemElement.style.backgroundColor);
    inputElement.showPicker();
    setTimeout(() => (labelDetails.colorPickerContainer = containerElement));
  }

  public static setEvents(container: HTMLElement, colorInput: HTMLElement, columnDetails: ColumnDetailsT) {
    container.onmousedown = SelectColorButtonEvents.mouseDownContainer.bind(this, columnDetails);
    colorInput.oninput = SelectColorButtonEvents.inputEvent.bind(this, columnDetails.selectDropdown);
  }
}
