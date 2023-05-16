import {ColumnDetailsT, ColumnsDetailsT} from '../../../../types/columnDetails';
import {_CellDropdown} from '../../../../types/cellDropdownInternal';
import {OptionColorButtonEvents} from './optionColorButtonEvents';
import {Browser} from '../../../../utils/browser/browser';
import {OptionDeleteButton} from './optionDeleteButton';
import {OptionColorButton} from './optionColorButton';

export class OptionButton {
  public static readonly BUTTON_CONTAINER_CLASS = 'cell-dropdown-option-button-container';
  public static readonly BUTTON_CLASS = 'cell-dropdown-option-button';

  public static changeVisibility(event: MouseEvent, dropdown: _CellDropdown, displayOnDropdown?: HTMLElement) {
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
  public static hideAfterColorPickerContainerClose(columnsDetails: ColumnsDetailsT, columnDetails: ColumnDetailsT) {
    const {cellDropdown: {labelDetails}} = columnDetails;
    if (labelDetails?.colorPickerContainer) {
      labelDetails.colorPickerContainer.style.display = 'none';
      const deleteButtonContainer = labelDetails.colorPickerContainer.previousElementSibling as HTMLElement;
      deleteButtonContainer.style.display = 'none';
      delete labelDetails.colorPickerContainer;
      OptionColorButtonEvents.updateColumnLabelColors(columnsDetails, columnDetails);
    }
  }
}
