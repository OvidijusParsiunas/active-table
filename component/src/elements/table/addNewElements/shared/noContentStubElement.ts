import {TableDimensionsUtils} from '../../../../utils/tableDimensions/tableDimensionsUtils';
import {AddNewRowElement} from '../row/addNewRowElement';
import {ActiveTable} from '../../../../activeTable';

// REF-18
export class NoContentStubElement {
  private static readonly NO_CONTENT_STUB_CLASS = 'no-content-stub';

  private static convertFromStub(event: MouseEvent) {
    const addNewRowCell = event.target as HTMLElement;
    addNewRowCell.classList.remove(NoContentStubElement.NO_CONTENT_STUB_CLASS);
    AddNewRowElement.setDefaultStyle(addNewRowCell);
    addNewRowCell.removeEventListener('click', NoContentStubElement.convertFromStub);
  }

  public static convertToStub(addNewRowCell: HTMLElement) {
    addNewRowCell.classList.add(NoContentStubElement.NO_CONTENT_STUB_CLASS);
    addNewRowCell.innerText = '+';
    addNewRowCell.style.width = `${TableDimensionsUtils.MINIMAL_TABLE_WIDTH}px`;
  }

  // addNewRowCell is preserved as it is reused as the stub element
  private static removeRows(tableBodyElement: HTMLElement) {
    Array.from(tableBodyElement.children)
      .slice(0, tableBodyElement.children.length - 1)
      .forEach((rowElement) => rowElement.remove());
  }

  // prettier-ignore
  public static display(at: ActiveTable) {
    const {tableBodyElementRef, addColumnCellsElementsRef, addRowCellElementRef,
      auxiliaryTableContentInternal: {displayAddColumnCell, displayAddRowCell}} = at;
    if (!addRowCellElementRef) return;
    const tableBodyElement = tableBodyElementRef as HTMLElement;
    if (displayAddColumnCell) addColumnCellsElementsRef.splice(0, addColumnCellsElementsRef.length);
    NoContentStubElement.removeRows(tableBodyElement);
    if (displayAddRowCell) {
      NoContentStubElement.convertToStub(addRowCellElementRef);
      addRowCellElementRef.addEventListener('click', NoContentStubElement.convertFromStub);
    }
    AddNewRowElement.setDisplay(addRowCellElementRef, true);
    
  }
}
