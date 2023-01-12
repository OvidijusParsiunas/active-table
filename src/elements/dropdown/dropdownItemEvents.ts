import {DropdownItemHighlightUtils} from '../../utils/color/dropdownItemHighlightUtils';
import {ElementVisibility} from '../../utils/elements/elementVisibility';
import {ActiveOverlayElements} from '../../types/activeOverlayElements';
import {EditableTableComponent} from '../../editable-table-component';
import {OverflowUtils} from '../../utils/overflow/overflowUtils';

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
    const nestedDropdownElement = (event.target as HTMLElement).children[2] as HTMLElement;
    nestedDropdownElement.style.display = 'none';
    DropdownItemEvents.resetDropdownPosition(nestedDropdownElement);
  }

  private static correctPosition(nestedDropdownElement: HTMLElement, parentDropdownElement: HTMLElement) {
    const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
    if (!visibilityDetails.isFullyVisible) {
      nestedDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      const visibilityDetails = ElementVisibility.getDetailsInWindow(nestedDropdownElement);
      if (!visibilityDetails.isFullyVisible) {
        nestedDropdownElement.style.left = '';
      }
    }
  }

  // prettier-ignore
  private static correctPositionForOverflow(etc: EditableTableComponent,
      nestedDropdownElement: HTMLElement, parentDropdownElement: HTMLElement) {
    const {tableElementRef, overflowInternal} = etc;
    if (!tableElementRef || !overflowInternal) return;
    if (tableElementRef.offsetWidth !== overflowInternal.overflowContainer.scrollWidth) {
      nestedDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      if (nestedDropdownElement.getBoundingClientRect().x < 0) {
        nestedDropdownElement.style.left = '';
      }
    }
  }

  private static displayAndSetNestedDropdownPosition(this: EditableTableComponent, event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[2] as HTMLElement;
    const parentDropdownElement = (event.target as HTMLElement).parentElement as HTMLElement;
    nestedDropdownElement.style.left = parentDropdownElement.style.width;
    nestedDropdownElement.style.display = parentDropdownElement.style.display;
    if (this.overflowInternal && OverflowUtils.isOverflowElement(this.overflowInternal.overflowContainer)) {
      DropdownItemEvents.correctPositionForOverflow(this, nestedDropdownElement, parentDropdownElement);
    } else {
      DropdownItemEvents.correctPosition(nestedDropdownElement, parentDropdownElement);
    }
  }

  // prettier-ignore
  public static addNestedItemEvents(etc: EditableTableComponent, element: HTMLElement) {
    element.addEventListener('mouseenter', DropdownItemEvents.displayAndSetNestedDropdownPosition.bind(etc));
    element.addEventListener('mouseleave', DropdownItemEvents.hideNestedDropdown);
    // this is required because when the user hovers over the item with mouse and then hovers over the nested dropdown,
    // upon hovering the item again - the above would not fire mouse enter as the dropdown is within the item element
    const itemContents = element.children[1] as HTMLElement;
    itemContents.addEventListener('mouseenter',
      DropdownItemHighlightUtils.highlightNew.bind(this, etc.activeOverlayElements, element)
    );
  }
}
