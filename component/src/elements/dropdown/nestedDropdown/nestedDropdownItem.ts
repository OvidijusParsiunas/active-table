export class NestedDropdownItem {
  public static readonly NESTED_DROPDOWN_ITEM = 'nested-dropdown-item';

  public static resetItemStyle(nestedDropdown: HTMLElement) {
    Array.from(nestedDropdown.children).forEach((item) => {
      const itemElement = item as HTMLElement;
      itemElement.style.backgroundColor = '';
      itemElement.style.color = '';
    });
  }
}
