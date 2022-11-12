import {EditableTableComponent} from '../../../editable-table-component';

// this is exclusively used to toggle the add column button's cells' background colors
// REF-17
export class ColumnGroupElement {
  public static update(etc: EditableTableComponent) {
    const {columnGroupRef, columnsDetails} = etc;
    if (!columnGroupRef) return;
    // the first col needs to span all of the columns except the add new column
    const firstCols = columnGroupRef.children[0] as HTMLElement;
    // cannot simply overwrite span and need to instead replace the element
    const newFirstCols = document.createElement('col');
    // number 2 is used to include the divider elements between the columns
    newFirstCols.span = columnsDetails.length * 2;
    columnGroupRef.replaceChild(newFirstCols, firstCols);
  }

  public static create() {
    const colGroup = document.createElement('colgroup');
    // the first col needs to span all of the columns except the add new column
    const dataColumnsCol = document.createElement('col');
    // the second col needs to span only the add new column
    const addColumnCol = document.createElement('col');
    addColumnCol.span = 1;
    colGroup.appendChild(dataColumnsCol);
    colGroup.appendChild(addColumnCol);
    return colGroup;
  }
}
