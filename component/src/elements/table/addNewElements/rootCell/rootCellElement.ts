import {TableDimensionsUtils} from '../../../../utils/tableDimensions/tableDimensionsUtils';
import {ElementStyle} from '../../../../utils/elements/elementStyle';
import {AddNewRowElement} from '../row/addNewRowElement';
import {ActiveTable} from '../../../../activeTable';
import {RootCellEvents} from './rootCellEvents';

// REF-18
export class RootCellElement {
  private static readonly ROOT_CELL_CLASS = 'root-cell';

  // prettier-ignore
  public static convertFromRootCell(at: ActiveTable) {
    const {_addRowCellElementRef, rootCell, _eventFunctions: {rootCell: rootCellEvents}} = at;
    if (!_addRowCellElementRef) return;
    _addRowCellElementRef.classList.remove(RootCellElement.ROOT_CELL_CLASS);
    if (rootCell?.styles) ElementStyle.unsetAllCSSStates(_addRowCellElementRef, rootCell.styles);
    RootCellEvents.removeEvents(_addRowCellElementRef, rootCellEvents);
  }

  public static convertToRootCell(addNewRowCell: HTMLElement, text?: string) {
    addNewRowCell.classList.add(RootCellElement.ROOT_CELL_CLASS);
    addNewRowCell.innerText = text || '+';
    addNewRowCell.style.width = `${TableDimensionsUtils.MINIMAL_TABLE_WIDTH}px`;
  }

  // addNewRowCell is preserved as it is reused as the root cell
  private static removeRows(tableBodyElement: HTMLElement) {
    Array.from(tableBodyElement.children)
      .slice(0, tableBodyElement.children.length - 1)
      .forEach((rowElement) => rowElement.remove());
  }

  // prettier-ignore
  public static display(at: ActiveTable) {
    const {_tableBodyElementRef, _addColumnCellsElementsRef, _addRowCellElementRef, rootCell,
      _frameComponents: {displayAddNewColumn, displayAddNewRow}} = at;
    if (!_addRowCellElementRef) return;
    const tableBodyElement = _tableBodyElementRef as HTMLElement;
    if (displayAddNewColumn) _addColumnCellsElementsRef.splice(0, _addColumnCellsElementsRef.length);
    RootCellElement.removeRows(tableBodyElement);
    if (displayAddNewRow) RootCellElement.convertToRootCell(_addRowCellElementRef, rootCell?.text);
    if (!at._eventFunctions.rootCell.applied) RootCellEvents.applyEvents(at, _addRowCellElementRef);
    AddNewRowElement.setDisplay(_addRowCellElementRef, true);
  }
}
