import {DropdownItem} from '../../../elements/dropdown/dropdownItem';

export class OuterDropdownItem {
  public static unsetHoverColors(items: HTMLElement[]) {
    // active item uses a class so unsetting this prop doesn't affect it
    items.forEach((item) => (item.style.backgroundColor = ''));
  }

  public static unsetActiveItem(dropdownElement: HTMLElement) {
    const activeItem = dropdownElement.getElementsByClassName(DropdownItem.ACTIVE_ITEM_CLASS)[0] as HTMLElement;
    activeItem?.classList.remove(DropdownItem.ACTIVE_ITEM_CLASS);
  }

  public static setActive(items: HTMLElement[], targetItemText: string) {
    const activeItem = items.find((item) => item.innerText === targetItemText);
    activeItem?.classList.add(DropdownItem.ACTIVE_ITEM_CLASS);
  }
}
