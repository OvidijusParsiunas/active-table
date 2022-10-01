import {CategoryDropdownItems} from '../../../types/columnDetails';

// REF-4
export class CategoryDropdownHorizontalScroll {
  private static readonly BOTTOM_PADDING_IF_HORIZONTAL_SCROLL = '12px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  // prettier-ignore
  public static setPropertiesIfHorizontalScrollPresent(dropdownElement: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    const { scrollWidth, clientWidth, style } = dropdownElement;
    if (scrollWidth > clientWidth && !categoryDropdownItems.isHorizontalScrollPresent) {
      categoryDropdownItems.isHorizontalScrollPresent = true;
      style.paddingBottom = CategoryDropdownHorizontalScroll.BOTTOM_PADDING_IF_HORIZONTAL_SCROLL;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollBy(0, CategoryDropdownHorizontalScroll.SCROLL_FURTHER_BOTTOM_PX);
  }
}
