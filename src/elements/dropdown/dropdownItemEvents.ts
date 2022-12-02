import {DropdownItemHighlightUtils} from '../../utils/color/dropdownItemHighlightUtils';
import {ElementVisibility} from '../../utils/elements/elementVisibility';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';

export class DropdownItemEvents {
  // prettier-ignore
  public static addItemEvents(activeOverlayElements: ActiveOverlayElements, element: HTMLElement) {
    element.addEventListener('mouseenter',
      DropdownItemHighlightUtils.highlightNew.bind(this, activeOverlayElements, element));
    // the reason why we need mouse leave on the item as well as on mouse enter is because the mouse can leave the dropdown
    // without entering another item
    element.addEventListener('mouseleave',
      DropdownItemHighlightUtils.fadeCurrentlyHighlighted.bind(this, activeOverlayElements));
  }

  private static resetDropdownPosition(nestedDropdownElement: HTMLElement) {
    nestedDropdownElement.style.left = '';
  }

  private static hideNestedDropdown(event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    nestedDropdownElement.style.display = 'none';
    DropdownItemEvents.resetDropdownPosition(nestedDropdownElement);
  }

  private static displayAndSetNestedDropdownPosition(event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[1] as HTMLElement;
    const parentDropdownElement = (event.target as HTMLElement).parentElement as HTMLElement;
    nestedDropdownElement.style.left = parentDropdownElement.style.width;
    nestedDropdownElement.style.display = parentDropdownElement.style.display;
    const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      nestedDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
      if (!visibilityDetails.isFullyVisible) {
        nestedDropdownElement.style.left = '';
      }
    }
  }

  public static addNestedItemEvents(element: HTMLElement) {
    element.addEventListener('mouseenter', DropdownItemEvents.displayAndSetNestedDropdownPosition);
    element.addEventListener('mouseleave', DropdownItemEvents.hideNestedDropdown);
  }
}
