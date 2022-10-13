import {ScrollbarUtils} from '../../../utils/scrollbar/scrollbarUtils';
import {CategoryDropdownT} from '../../../types/columnDetails';

// REF-4
export class CategoryDropdownHorizontalScrollFix {
  private static readonly NEW_BOTTOM_PADDING_IF_PRESENT = '12px';
  private static readonly DEFAULT_BOTTOM_PADDING_IF_PRESENT = '1px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  public static setPropertiesIfHorizontalScrollPresent(dropdown: CategoryDropdownT) {
    const {element, scrollbarPresence} = dropdown;
    // fix is only needed when both horizontal and vertical scrolls are present
    if (ScrollbarUtils.isHorizontalPresent(element) && ScrollbarUtils.isVerticalPresent(element)) {
      scrollbarPresence.horizontal = true;
      element.style.paddingBottom = CategoryDropdownHorizontalScrollFix.NEW_BOTTOM_PADDING_IF_PRESENT;
    } else {
      scrollbarPresence.horizontal = false;
      element.style.paddingBottom = CategoryDropdownHorizontalScrollFix.DEFAULT_BOTTOM_PADDING_IF_PRESENT;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollTop += CategoryDropdownHorizontalScrollFix.SCROLL_FURTHER_BOTTOM_PX;
  }
}
