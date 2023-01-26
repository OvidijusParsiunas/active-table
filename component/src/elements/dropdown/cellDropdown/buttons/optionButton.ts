import {CellDropdownI} from '../../../../types/cellDropdownInternal';
import {OptionColorButtonEvents} from './optionColorButtonEvents';
import {ColumnDetailsT} from '../../../../types/columnDetails';
import {Browser} from '../../../../utils/browser/browser';
import {OptionDeleteButton} from './optionDeleteButton';
import {OptionColorButton} from './optionColorButton';

export class OptionButton {
  public static readonly BUTTON_CONTAINER_CLASS = 'cell-drodown-option-button-container';
  public static readonly BUTTON_CLASS = 'cell-drodown-option-button';

  public static changeVisibility(event: MouseEvent, dropdown: CellDropdownI, displayOnDropdown?: HTMLElement) {
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const rightSideDelta = dropdown.scrollbarPresence.vertical ? 31 : 16;
      OptionDeleteButton.changeVisibility(itemElement, rightSideDelta, displayOnDropdown);
      if (Browser.IS_COLOR_PICKER_SUPPORTED && dropdown.labelDetails && !dropdown.labelDetails.colorPickerContainer) {
        OptionColorButton.changeVisibility(itemElement, rightSideDelta + 18, displayOnDropdown);
      }
    }
  }

  // prettier-ignore
  public static hideAfterColorPickerContainerClose(columnDetails: ColumnDetailsT) {
    const {cellDropdown: {labelDetails}, elements} = columnDetails;
    if (labelDetails?.colorPickerContainer) {
      labelDetails.colorPickerContainer.style.display = 'none';
      const deleteButtonContainer = labelDetails.colorPickerContainer.previousElementSibling as HTMLElement;
      deleteButtonContainer.style.display = 'none';
      delete labelDetails.colorPickerContainer;
      OptionColorButtonEvents.updateColumnLabelColors(columnDetails, elements);
    }
  }
}
