import {TableDimensionsUtils} from '../../../../utils/tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {AddNewRowElement} from '../row/addNewRowElement';

// WORK - not sure if the user should be able to remove the header row

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
    addNewRowCell.textContent = '+';
    addNewRowCell.style.width = `${TableDimensionsUtils.MINIMAL_TABLE_WIDTH}px`;
  }

  // addNewRowCell is preserved as it is reused as the stub element
  private static removeRows(tableBodyElement: HTMLElement) {
    Array.from(tableBodyElement.children)
      .slice(0, tableBodyElement.children.length - 1)
      .forEach((rowElement) => rowElement.remove());
  }

  public static display(etc: EditableTableComponent) {
    const {addColumnCellsElementsRef, addRowCellElementRef} = etc;
    if (!addRowCellElementRef) return;
    const tableBodyElement = etc.tableBodyElementRef as HTMLElement;
    if (etc.displayAddColumnCell) addColumnCellsElementsRef.splice(0, addColumnCellsElementsRef.length);
    NoContentStubElement.removeRows(tableBodyElement);
    if (etc.displayAddRowCell) {
      NoContentStubElement.convertToStub(addRowCellElementRef);
      addRowCellElementRef.addEventListener('click', NoContentStubElement.convertFromStub);
    } else {
      AddNewRowElement.setDisplay(addRowCellElementRef, false);
    }
  }
}
