import {TableElementEventState} from '../../types/tableElementEventState';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';

export class DropdownItemHighlightUtils {
  private static readonly HOVER_BACKGROUND_COLOR = '#eaeaea';

  // Accepted behaviour - fadeFocused is triggered twice when moving to a different item
  public static fadeCurrentlyHighlighted(tableElementEventState: TableElementEventState) {
    const activeElement = tableElementEventState.activeDropdownIcon;
    if (activeElement) {
      activeElement.style.backgroundColor = '';
      delete tableElementEventState.activeDropdownIcon;
    }
  }

  public static highlightNew(tableElementEventState: TableElementEventState, itemElement: HTMLElement) {
    DropdownItemHighlightUtils.fadeCurrentlyHighlighted(tableElementEventState);
    itemElement.focus();
    tableElementEventState.activeDropdownIcon = itemElement;
    if (!itemElement.classList.contains(DropdownItem.DROPDOWN_INPUT_CLASS)) {
      itemElement.style.backgroundColor = DropdownItemHighlightUtils.HOVER_BACKGROUND_COLOR;
    }
  }
}
