import {EditableTableComponent} from '../../../../../editable-table-component';
import {SelectCellTextBaseEvents} from '../baseEvents/selectCellTextBaseEvents';
import {SelectCellBaseEvents} from '../baseEvents/selectCellBaseEvents';
import {ArrowDownIconElement} from './arrowDownIconElement';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {Dropdown} from '../../../../dropdown/dropdown';

export class SelectCellEvents {
  private static mouseLeaveCell(this: EditableTableComponent, columnIndex: number, event: MouseEvent) {
    delete this.hoveredElements.selectCell;
    const cellElement = event.target as HTMLElement;
    const {selectDropdown} = this.columnsDetails[columnIndex];
    if (!Dropdown.isDisplayed(selectDropdown.element) || selectDropdown.displayedCellElement !== cellElement) {
      ArrowDownIconElement.toggle(cellElement, false);
    }
  }

  private static mouseEnterCell(this: EditableTableComponent, event: MouseEvent) {
    this.hoveredElements.selectCell = event.target as HTMLElement;
    ArrowDownIconElement.toggle(this.hoveredElements.selectCell, true);
  }

  // prettier-ignore
  private static mouseDownCell(this: EditableTableComponent, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const cellElement = (targetElement.classList.contains(ArrowDownIconElement.ARROW_ICON_CLASS)
      ? targetElement.parentElement?.parentElement : targetElement) as HTMLElement;
    CellWithTextEvents.programmaticMouseDown(this, SelectCellBaseEvents.blurIfDropdownFocused, cellElement, event);
  }

  public static setEvents(etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!etc.columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = SelectCellEvents.mouseEnterCell.bind(etc);
    cellElement.onmouseleave = SelectCellEvents.mouseLeaveCell.bind(etc, columnIndex);
    cellElement.onmousedown = SelectCellEvents.mouseDownCell.bind(etc);
    const textElement = cellElement.children[0] as HTMLElement;
    SelectCellTextBaseEvents.setEvents(etc, textElement, rowIndex, columnIndex);
  }
}
