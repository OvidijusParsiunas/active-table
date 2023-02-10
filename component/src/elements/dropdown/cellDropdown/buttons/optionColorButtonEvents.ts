import {CellDropdownI, ColorPickerNewValue, LabelDetails} from '../../../../types/cellDropdownInternal';
import {ColumnDetailsT, ColumnsDetailsT} from '../../../../types/columnDetails';
import {PickerInputElement} from '../../../../types/pickerInputElement';
import {FocusedElements} from '../../../../types/focusedElements';
import {RGBAToHex} from '../../../../utils/color/rgbaToHex';
import {OptionColorButton} from './optionColorButton';
import {OptionButton} from './optionButton';

export class OptionColorButtonEvents {
  private static updateCellElements(columnDetails: ColumnDetailsT, colorPickerNewValue: ColorPickerNewValue) {
    const {itemText, backgroundColor} = colorPickerNewValue;
    columnDetails.elements.slice(1).forEach((element) => {
      const textElement = element.children[0] as HTMLElement;
      if (textElement.innerText === itemText) textElement.style.backgroundColor = backgroundColor;
    });
  }

  // prettier-ignore
  private static updateIfUpdatable(columnDetails: ColumnDetailsT, defaultColumnTypeName: string,
      colorPickerNewValue: ColorPickerNewValue) {
    const {itemText, backgroundColor} = colorPickerNewValue;
    const itemDetails = columnDetails.cellDropdown.itemsDetails[itemText];
    if (itemDetails && (!itemDetails.isCustomBackgroundColor || defaultColumnTypeName === columnDetails.activeType.name)) {
      itemDetails.backgroundColor = backgroundColor;
      OptionColorButtonEvents.updateCellElements(columnDetails, colorPickerNewValue);
    }
  }

  // prettier-ignore
  private static updateElements(columnsDetails: ColumnsDetailsT, defaultColumnTypeName: string,
      colorPickerNewValue: ColorPickerNewValue) {
    columnsDetails.forEach((columnDetails) => {
      if (columnDetails.cellDropdown.labelDetails) {
        OptionColorButtonEvents.updateIfUpdatable(columnDetails, defaultColumnTypeName, colorPickerNewValue)
      }
    });
  }

  private static updateColorStates(columnDetails: ColumnDetailsT, colorPickerNewValue: ColorPickerNewValue) {
    const {itemText, backgroundColor} = colorPickerNewValue;
    // type state
    columnDetails.activeType.cellDropdownProps?.options?.forEach((option) => {
      if (option.text === itemText) option.backgroundColor = backgroundColor;
    });
    // global color state
    const existingColors = columnDetails.cellDropdown.labelDetails?.globalItemColors.existingColors;
    if (existingColors?.[itemText]) existingColors[itemText] = backgroundColor;
  }

  // prettier-ignore
  public static updateColumnLabelColors(columnsDetails: ColumnsDetailsT, columnDetails: ColumnDetailsT) {
    const {cellDropdown: {labelDetails}, activeType} = columnDetails;
    if (!labelDetails || !labelDetails.colorPickerNewValue) return;
    OptionColorButtonEvents.updateColorStates(columnDetails, labelDetails.colorPickerNewValue);
    OptionColorButtonEvents.updateElements(columnsDetails, activeType.name, labelDetails.colorPickerNewValue);
    delete labelDetails.colorPickerNewValue;
    setTimeout(() => columnDetails.fireColumnsUpdate());
  }

  // important to note that mouse/key down events are not fired when clicked on picker
  public static windowEventClosePicker(columnsDetails: ColumnsDetailsT, focusedElements: FocusedElements) {
    if (focusedElements.cellDropdown) {
      const columnIndex = focusedElements.cell.columnIndex as number;
      OptionButton.hideAfterColorPickerContainerClose(columnsDetails, columnsDetails[columnIndex]);
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
  private static mouseDownContainer(columnsDetails: ColumnsDetailsT, columnDetails: ColumnDetailsT, event: MouseEvent) {
    const {cellDropdown: {labelDetails}} = columnDetails;
    if (!labelDetails) return;
    if (labelDetails.colorPickerContainer) {
      delete labelDetails.colorPickerContainer;
      OptionColorButtonEvents.updateColumnLabelColors(columnsDetails, columnDetails);
      return;
    }
    const buttonElement = event.target as HTMLElement;
    const {containerElement, dropdownItemElement} = OptionColorButton.extractRelativeParentElements(buttonElement);
    const inputElement = buttonElement.previousSibling as PickerInputElement;
    // using getComputedStyle because if custom backgroundColor is 'red', that's what .style.backgroundColor will return 
    inputElement.value = RGBAToHex.convert(getComputedStyle(dropdownItemElement).backgroundColor);
    inputElement.showPicker();
    setTimeout(() => (labelDetails.colorPickerContainer = containerElement));
  }

  // prettier-ignore
  public static setEvents(container: HTMLElement, colorInput: HTMLElement, columnsDetails: ColumnsDetailsT,
      columnDetails: ColumnDetailsT) {
    container.onmousedown = OptionColorButtonEvents.mouseDownContainer.bind(this, columnsDetails, columnDetails);
    colorInput.oninput = OptionColorButtonEvents.inputEvent.bind(this, columnDetails.cellDropdown);
  }
}
