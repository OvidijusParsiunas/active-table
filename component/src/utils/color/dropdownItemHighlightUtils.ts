import {StaticDropdown} from '../outerTableComponents/dropdown/staticDropdown';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';

export class DropdownItemHighlightUtils {
  public static readonly HOVER_BACKGROUND_COLOR = '#eaeaea';

  // Accepted behaviour - fadeFocused is triggered twice when moving to a different item
  public static fadeCurrentlyHighlighted(activeOverlayElements: ActiveOverlayElements) {
    const activeElement = activeOverlayElements.dropdownItem;
    if (activeElement) {
      if (activeElement.classList.contains(StaticDropdown.ACTIVE_ITEM_CLASS)) {
        activeElement.classList.remove(StaticDropdown.ACTIVE_ITEM_CLASS);
      }
      activeElement.style.backgroundColor = '';
      delete activeOverlayElements.dropdownItem;
    }
  }

  public static highlightNew(activeOverlayElements: ActiveOverlayElements, itemElement: HTMLElement) {
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(activeOverlayElements);
    itemElement.focus();
    activeOverlayElements.dropdownItem = itemElement;
    if (itemElement.classList.contains(StaticDropdown.ITEM_CLASS)) {
      itemElement.classList.add(StaticDropdown.ACTIVE_ITEM_CLASS);
    } else if (!itemElement.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS)) {
      itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
    }
  }
}
