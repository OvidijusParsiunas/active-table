import {DropdownOverlays, SelectDropdownT} from '../../../../types/columnDetails';
import {SelectDeleteButton} from './selectDeleteButton';
import {SelectColorButton} from './selectColorButton';

export class SelectButton {
  public static readonly SELECT_BUTTON_CONTAINER_CLASS = 'select-button-container';
  public static readonly SELECT_BUTTON_CLASS = 'select-button';

  public static changeVisibility(event: MouseEvent, dropdown: SelectDropdownT, displayOnDropdown?: HTMLElement) {
    if (event.isTrusted) {
      const itemElement = event.target as HTMLElement;
      const rightSideDelta = dropdown.scrollbarPresence.vertical ? 31 : 16;
      SelectDeleteButton.changeVisibility(itemElement, rightSideDelta, displayOnDropdown);
      if (dropdown.newItemColors && !dropdown.overlays.colorPickerContainer) {
        SelectColorButton.changeVisibility(itemElement, rightSideDelta + 18, displayOnDropdown);
      }
    }
  }

  public static hideAfterColorPickerContainerClose(overlays: DropdownOverlays) {
    if (overlays.colorPickerContainer) {
      overlays.colorPickerContainer.style.display = 'none';
      const deleteButtonContainer = overlays.colorPickerContainer.previousElementSibling as HTMLElement;
      deleteButtonContainer.style.display = 'none';
      delete overlays.colorPickerContainer;
    }
  }
}
