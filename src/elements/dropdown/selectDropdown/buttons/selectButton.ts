import {SelectDropdownT} from '../../../../types/columnDetails';
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
      if (!dropdown.overlays.colorPickerInput) {
        SelectColorButton.changeVisibility(itemElement, rightSideDelta + 18, displayOnDropdown);
      }
    }
  }
}
