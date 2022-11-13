import {TableDimensionsUtils} from '../../../../utils/tableDimensions/tableDimensionsUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {AddNewColumnElement} from '../column/addNewColumnElement';
import {ColumnGroupElement} from '../column/columnGroupElement';
import {AddNewRowElement} from '../row/addNewRowElement';

// WORK - need to be able to delete first row when no header
// not sure if the user should be able to remove the header row
export class ElementWhenNoContent {
  private static readonly NO_CONTENT_ADD_NEW_COLUMN = 'no-content-add-new-column';

  private static changeAddNewColumnBackToContent(addNewColumnCell: HTMLElement, columnGroupRef: HTMLElement) {
    addNewColumnCell.classList.remove(ElementWhenNoContent.NO_CONTENT_ADD_NEW_COLUMN);
    addNewColumnCell.style.width = AddNewColumnElement.DEFAULT_WIDTH_PX;
    ColumnGroupElement.insertDataColumnsCol(columnGroupRef);
  }

  // prettier-ignore
  private static unsetAddNewColumn(displayAddColumnCell: boolean, addNewColumnCell: HTMLElement,
      columnGroupRef: HTMLElement) {
    if (displayAddColumnCell) {
      ElementWhenNoContent.changeAddNewColumnBackToContent(addNewColumnCell, columnGroupRef);
    } else {
      AddNewColumnElement.toggleDisplay(addNewColumnCell, false); // no need to unset the style and we can just hide it
    }
  }

  private static removeAllRows(tableBodyElement: HTMLElement, displayAddRowCell: boolean) {
    Array.from(tableBodyElement.children)
      // not removing the add new row row element
      .slice(1, displayAddRowCell ? tableBodyElement.children.length - 1 : tableBodyElement.children.length)
      .forEach((rowElement) => {
        rowElement.remove();
      });
  }

  public static setAddColumnCellStyle(addNewColumnCell: HTMLElement) {
    addNewColumnCell.classList.add(ElementWhenNoContent.NO_CONTENT_ADD_NEW_COLUMN);
    addNewColumnCell.style.width = `${TableDimensionsUtils.MINIMAL_TABLE_WIDTH}px`;
  }

  // prettier-ignore
  private static changeAddNewColumnToNoContent(tableBodyElement: HTMLElement, addNewColumnCell: HTMLElement,
      columnGroupRef: HTMLElement, displayAddRowCell: boolean) {
    ElementWhenNoContent.setAddColumnCellStyle(addNewColumnCell);
    ElementWhenNoContent.removeAllRows(tableBodyElement, displayAddRowCell);
    ColumnGroupElement.removeDataColumnsCol(columnGroupRef);
  }

  // prettier-ignore
  private static setAddNewColumn(tableBodyElement: HTMLElement, addNewColumnCell: HTMLElement,
      columnGroupRef: HTMLElement, displayAddRowCell: boolean) {
    if (addNewColumnCell.classList.contains(ElementWhenNoContent.NO_CONTENT_ADD_NEW_COLUMN)) {
      AddNewColumnElement.toggleDisplay(addNewColumnCell, true); // no need to set the style and we can just display it
    } else {
      ElementWhenNoContent.changeAddNewColumnToNoContent(tableBodyElement,
        addNewColumnCell, columnGroupRef, displayAddRowCell);
    }
  }

  private static toggleAddNewColumn(etc: EditableTableComponent) {
    const {addColumnCellsElementsRef, addRowCellElementRef, columnsDetails, tableBodyElementRef, columnGroupRef} = etc;
    // Will need this to work when no cells addColumnCellsElementsRef.length === 0
    if (!tableBodyElementRef || !columnGroupRef || !addRowCellElementRef || addColumnCellsElementsRef.length === 0) return;
    const addNewColumnCell = addColumnCellsElementsRef[0];
    if (columnsDetails.length === 0) {
      ElementWhenNoContent.setAddNewColumn(tableBodyElementRef, addNewColumnCell, columnGroupRef, etc.displayAddRowCell);
    } else {
      ElementWhenNoContent.unsetAddNewColumn(etc.displayAddColumnCell, addNewColumnCell, columnGroupRef);
    }
  }

  // TO-DO - no content rules:
  // when noHeader is true or noHeader is false but content is still []
  // when user sets add row button as displayed and column button as not - should display add row button
  // when user sets add row button as not displayed and column button as displayed - should display add column button
  // when user sets add row button as displayed and column as displayed - should display add column button
  // when user sets add row button as not displayed and column as not displayed - should display add column button
  // when header with no data content
  // when user sets add row button as displayed display it
  // when user sets add row button to as not displayed - do not display it
  // ESTABLISH remove row UX and add column button before proceeding any further with this
  public static toggle(etc: EditableTableComponent) {
    if (etc.displayAddColumnCell || !etc.displayAddRowCell) {
      // currently this is displayed everywhere and we have to
      // if add row element is displayed
      ElementWhenNoContent.toggleAddNewColumn(etc);
      if (etc.displayAddRowCell) {
        AddNewRowElement.toggleDisplay(etc.addRowCellElementRef as HTMLElement, etc.columnsDetails.length !== 0);
      }
    } else {
      // AddNewRowElement.toggle(etc);
    }
  }
}
