import {DropdownButtonItemSettings} from '../../../types/dropdownButtonItem';
import {ElementVisibility} from '../../../utils/elements/elementVisibility';
import {OverflowUtils} from '../../../utils/overflow/overflowUtils';
import {ActiveTable} from '../../../activeTable';
import {DropdownItem} from '../dropdownItem';
import {Dropdown} from '../dropdown';

export class NestedDropdown {
  public static create(at: ActiveTable, itemSettings: DropdownButtonItemSettings[]): HTMLElement;
  public static create(): HTMLElement;
  public static create(at?: ActiveTable, itemSettings?: DropdownButtonItemSettings[]) {
    const dropdownElement = Dropdown.createBase();
    dropdownElement.style.top = `-${Number.parseInt(dropdownElement.style.paddingTop) + 22}px`;
    if (at && itemSettings) DropdownItem.addNewButtonItems(at, dropdownElement, itemSettings);
    return dropdownElement;
  }

  private static resetPosition(nestedDropdownElement: HTMLElement) {
    nestedDropdownElement.style.left = '';
  }

  public static hideDropdown(event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[2] as HTMLElement;
    nestedDropdownElement.style.display = 'none';
    NestedDropdown.resetPosition(nestedDropdownElement);
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
  private static correctPositionForOverflow(at: ActiveTable,
      nestedDropdownElement: HTMLElement, parentDropdownElement: HTMLElement) {
    const {tableElementRef, overflowInternal} = at;
    if (!tableElementRef || !overflowInternal) return;
    if (tableElementRef.offsetWidth !== overflowInternal.overflowContainer.scrollWidth) {
      nestedDropdownElement.style.left = `-${parentDropdownElement.style.width}`;
      if (nestedDropdownElement.getBoundingClientRect().x < 0) {
        nestedDropdownElement.style.left = '';
      }
    }
  }

  public static displayAndSetDropdownPosition(this: ActiveTable, event: Event) {
    const nestedDropdownElement = (event.target as HTMLElement).children[2] as HTMLElement;
    const parentDropdownElement = (event.target as HTMLElement).parentElement as HTMLElement;
    nestedDropdownElement.style.left = parentDropdownElement.style.width;
    nestedDropdownElement.style.display = parentDropdownElement.style.display;
    if (this.overflowInternal && OverflowUtils.isOverflowElement(this.overflowInternal.overflowContainer)) {
      NestedDropdown.correctPositionForOverflow(this, nestedDropdownElement, parentDropdownElement);
    } else {
      NestedDropdown.correctPosition(nestedDropdownElement, parentDropdownElement);
    }
  }
}
