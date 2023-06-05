import {OuterDropdownItem} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItem';
import {OuterContainerDropdownI} from '../../../../../types/outerContainerInternal';
import {FilterInternal} from '../../../../../types/visibilityInternal';
import {FilterDropdownItemEvents} from './filterDropdownItemEvents';
import {DropdownItem} from '../../../../dropdown/dropdownItem';
import {ActiveTable} from '../../../../../activeTable';

export class FilterDropdownItem {
  private static setActive(at: ActiveTable, dropdownElement: HTMLElement, config: FilterInternal) {
    const index = at._columnsDetails.findIndex((columnDetail) => columnDetail.elements === config.elements);
    OuterDropdownItem.setActiveByIndex(Array.from(dropdownElement.children) as HTMLElement[], index);
  }

  private static addItems(at: ActiveTable, dropdown: OuterContainerDropdownI, config: FilterInternal) {
    const headers = at.content[0]?.map((headerText) => String(headerText));
    headers?.forEach((headerText) => {
      const itemsSettings = {text: headerText};
      const item = DropdownItem.addButtonItem(at, dropdown.element, itemsSettings);
      FilterDropdownItemEvents.setEvents(at, item, config, dropdown.activeButtonStyle);
    });
  }

  public static populate(at: ActiveTable, dropdown: OuterContainerDropdownI, config: FilterInternal) {
    dropdown.element.replaceChildren();
    FilterDropdownItem.addItems(at, dropdown, config);
    FilterDropdownItem.setActive(at, dropdown.element, config);
  }
}
