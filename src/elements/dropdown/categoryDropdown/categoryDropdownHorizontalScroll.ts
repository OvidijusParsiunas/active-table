import {CategoryDropdownItems} from '../../../types/columnDetails';

// REF-4
export class CategoryDropdownHorizontalScroll {
  private static readonly NEW_BOTTOM_PADDING_IF_PRESENT = '12px';
  private static readonly SCROLL_FURTHER_BOTTOM_PX = 14;

  private static isPresent(dropdownElement: HTMLElement) {
    return dropdownElement.scrollWidth > dropdownElement.clientWidth;
  }

  // prettier-ignore
  public static setPropertiesIfHorizontalScrollPresent(dropdownElement: HTMLElement,
      categoryDropdownItems: CategoryDropdownItems) {
    if (CategoryDropdownHorizontalScroll.isPresent(dropdownElement) && !categoryDropdownItems.isHorizontalScrollPresent) {
      categoryDropdownItems.isHorizontalScrollPresent = true;
      dropdownElement.style.paddingBottom = CategoryDropdownHorizontalScroll.NEW_BOTTOM_PADDING_IF_PRESENT;
    }
  }

  public static scrollDownFurther(dropdownElement: HTMLElement) {
    dropdownElement.scrollTop += CategoryDropdownHorizontalScroll.SCROLL_FURTHER_BOTTOM_PX;
  }
}
