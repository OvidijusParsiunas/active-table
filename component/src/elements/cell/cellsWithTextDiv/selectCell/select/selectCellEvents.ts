import {SelectCellTextBaseEvents} from '../baseEvents/selectCellTextBaseEvents';
import {SelectCellBaseEvents} from '../baseEvents/selectCellBaseEvents';
import {ArrowDownIconElement} from './arrowDownIconElement';
import {CellWithTextEvents} from '../../cellWithTextEvents';
import {ActiveTable} from '../../../../../activeTable';
import {Dropdown} from '../../../../dropdown/dropdown';
import {CellElement} from '../../../cellElement';

export class SelectCellEvents {
  private static mouseLeaveCell(this: ActiveTable, columnIndex: number, event: MouseEvent) {
    delete this._hoveredElements.selectCell;
    const cellElement = event.target as HTMLElement;
    const {cellDropdown} = this._columnsDetails[columnIndex];
    if (!Dropdown.isDisplayed(cellDropdown.element) || cellDropdown.displayedCellElement !== cellElement) {
      ArrowDownIconElement.toggle(cellElement, false);
    }
  }

  private static mouseEnterCell(this: ActiveTable, event: MouseEvent) {
    this._hoveredElements.selectCell = event.target as HTMLElement;
    ArrowDownIconElement.toggle(this._hoveredElements.selectCell, true);
  }

  private static mouseDownCell(this: ActiveTable, event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains(CellElement.CELL_CLASS)) {
      CellWithTextEvents.mouseDownCell(this, SelectCellBaseEvents.blurIfDropdownFocused, targetElement, event);
    } else if (targetElement.classList.contains(ArrowDownIconElement.ARROW_ICON_CLASS)) {
      const cellElement = targetElement.parentElement?.parentElement as HTMLElement;
      CellWithTextEvents.mouseDownCell(this, SelectCellBaseEvents.blurIfDropdownFocused, cellElement, event);
    }
  }

  public static setEvents(at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) {
    if (!at._columnsDetails[columnIndex].settings.isCellTextEditable) return;
    // important to note that this is still using data events that have not be overwritten here
    // onblur/onfocus do not work for firefox, hence using textElement and keeping it consistent across browsers
    cellElement.onblur = () => {};
    cellElement.onfocus = () => {};
    cellElement.onmouseenter = SelectCellEvents.mouseEnterCell.bind(at);
    cellElement.onmouseleave = SelectCellEvents.mouseLeaveCell.bind(at, columnIndex);
    cellElement.onmousedown = SelectCellEvents.mouseDownCell.bind(at);
    const textElement = cellElement.children[0] as HTMLElement;
    SelectCellTextBaseEvents.setEvents(at, textElement, rowIndex, columnIndex);
  }
}
