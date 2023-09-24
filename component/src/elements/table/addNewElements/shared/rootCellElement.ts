import {TableDimensionsUtils} from '../../../../utils/tableDimensions/tableDimensionsUtils';
import {AddNewRowElement} from '../row/addNewRowElement';
import {ActiveTable} from '../../../../activeTable';

// REF-18
export class RootCellElement {
  private static readonly ROOT_CELL_CLASS = 'root-cell';

  public static convertFromRootCell(event: {target: EventTarget | null}) {
    const addNewRowCell = event.target as HTMLElement;
    addNewRowCell.classList.remove(RootCellElement.ROOT_CELL_CLASS);
    AddNewRowElement.setDefaultStyle(addNewRowCell);
    addNewRowCell.removeEventListener('click', RootCellElement.convertFromRootCell);
  }

  public static convertToRootCell(addNewRowCell: HTMLElement) {
    addNewRowCell.classList.add(RootCellElement.ROOT_CELL_CLASS);
    addNewRowCell.innerText = '+';
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
    const {_tableBodyElementRef, _addColumnCellsElementsRef, _addRowCellElementRef,
      _frameComponents: {displayAddNewColumn, displayAddNewRow}} = at;
    if (!_addRowCellElementRef) return;
    const tableBodyElement = _tableBodyElementRef as HTMLElement;
    if (displayAddNewColumn) _addColumnCellsElementsRef.splice(0, _addColumnCellsElementsRef.length);
    RootCellElement.removeRows(tableBodyElement);
    if (displayAddNewRow) {
      RootCellElement.convertToRootCell(_addRowCellElementRef);
      _addRowCellElementRef.addEventListener('click', RootCellElement.convertFromRootCell);
    }
    AddNewRowElement.setDisplay(_addRowCellElementRef, true);
    
  }
}
