import {DropdownItem} from '../../elements/dropdown/dropdownItem';

export class DropdownItemHighlightUtils {
  private static readonly HOVER_BACKGROUND_COLOR = '#eaeaea';

  // Accepted behaviour - fadeFocused is triggered twice when moving to a different item
  // An alternative solution would be to keep state of the currently hovered item instead of the shadowRoot.activeElement,
  // however that would create a need for each dropdown to hold their unique state which is a little too much, hence using
  // shadowRoot.activeElement until a bug is discovered or more functionality is required
  public static fadeCurrentlyHighlighted(shadowRoot: ShadowRoot | null) {
    const activeElement = shadowRoot?.activeElement as HTMLElement;
    if (activeElement) activeElement.style.backgroundColor = '';
  }

  public static highlightNew(this: ShadowRoot | null, itemElement: HTMLElement) {
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(this);
    itemElement.focus();
    if (!itemElement.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS)) {
      itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
    }
  }
}
