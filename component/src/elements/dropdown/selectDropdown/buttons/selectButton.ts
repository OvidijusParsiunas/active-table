import {ColumnDetailsT, SelectDropdownI} from '../../../../types/columnDetails';
import {SelectColorButtonEvents} from './selectColorButtonEvents';
import {Browser} from '../../../../utils/browser/browser';
import {SelectDeleteButton} from './selectDeleteButton';
import {SelectColorButton} from './selectColorButton';

export class SelectButton {
  public static readonly SELECT_BUTTON_CONTAINER_CLASS = 'select-button-container';
  public static readonly SELECT_BUTTON_CLASS = 'select-button';

  public static changeVisibility(event: MouseEvent, dropdown: SelectDropdownI, displayOnDropdown?: HTMLElement) {
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const rightSideDelta = dropdown.scrollbarPresence.vertical ? 31 : 16;
      SelectDeleteButton.changeVisibility(itemElement, rightSideDelta, displayOnDropdown);
      if (Browser.IS_COLOR_PICKER_SUPPORTED && dropdown.labelDetails && !dropdown.labelDetails.colorPickerContainer) {
        SelectColorButton.changeVisibility(itemElement, rightSideDelta + 18, displayOnDropdown);
      }
    }
  }

  // prettier-ignore
  public static hideAfterColorPickerContainerClose(columnDetails: ColumnDetailsT) {
    const {selectDropdown: {labelDetails}, elements} = columnDetails;
    if (labelDetails?.colorPickerContainer) {
      labelDetails.colorPickerContainer.style.display = 'none';
      const deleteButtonContainer = labelDetails.colorPickerContainer.previousElementSibling as HTMLElement;
      deleteButtonContainer.style.display = 'none';
      delete labelDetails.colorPickerContainer;
      SelectColorButtonEvents.updateColumnLabelColors(columnDetails, elements);
    }
  }
}
