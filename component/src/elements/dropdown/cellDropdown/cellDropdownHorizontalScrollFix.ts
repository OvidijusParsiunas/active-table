import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {CellDropdownI} from '../../../types/cellDropdownInternal';
import {Dropdown} from '../dropdown';

// REF-4
export class CellDropdownHorizontalScrollFix {
  private static readonly NEW_BOTTOM_PADDING_IF_PRESENT = '8px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  public static setPropertiesIfHorizontalScrollPresent(dropdown: CellDropdownI) {
    const {element, scrollbarPresence, customDropdownStyle} = dropdown;
    // fix is only needed when both horizontal and vertical scrolls are present
    if (ScrollbarUtils.isHorizontalPresent(element) && ScrollbarUtils.isVerticalPresent(element)) {
      scrollbarPresence.horizontal = true;
      element.style.paddingBottom = CellDropdownHorizontalScrollFix.NEW_BOTTOM_PADDING_IF_PRESENT;
    } else {
      scrollbarPresence.horizontal = false;
      element.style.paddingBottom = customDropdownStyle?.paddingBottom || Dropdown.DROPDOWN_VERTICAL_PX;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollTop += CellDropdownHorizontalScrollFix.SCROLL_FURTHER_BOTTOM_PX;
  }
}
