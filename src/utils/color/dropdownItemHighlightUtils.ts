import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';

export class DropdownItemHighlightUtils {
  private static readonly HOVER_BACKGROUND_COLOR = '#eaeaea';

  // Accepted behaviour - fadeFocused is triggered twice when moving to a different item
  public static fadeCurrentlyHighlighted(activeOverlayElements: ActiveOverlayElements) {
    const activeElement = activeOverlayElements.dropdownItem;
    if (activeElement) {
      activeElement.style.backgroundColor = '';
      delete activeOverlayElements.dropdownItem;
    }
  }

  public static highlightNew(activeOverlayElements: ActiveOverlayElements, itemElement: HTMLElement) {
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(activeOverlayElements);
    itemElement.focus();
    activeOverlayElements.dropdownItem = itemElement;
    if (!itemElement.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS)) {
      itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
    }
  }
}
