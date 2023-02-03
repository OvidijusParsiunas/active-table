import {CellElementIndex} from '../../../../utils/elements/cellElementIndex';
import {CellStateColorsR} from '../../../../types/cellStateColors';
import {ActiveTable} from '../../../../activeTable';

// this is exclusively used to toggle the add column button's cells' background colors
// REF-17
// prettier-ignore
export class ColumnGroupElement {
  public static update(at: ActiveTable) {
    const {columnGroupRef, columnsDetails, frameComponentsInternal: {displayIndexColumn}} = at;
    if (!columnGroupRef) return;
    // the first col needs to span all of the columns except the add new column
    const firstCols = columnGroupRef.children[0] as HTMLElement;
    // cannot simply overwrite span and need to instead replace the element
    const newFirstCols = document.createElement('col');
    newFirstCols.span = CellElementIndex.getViaColumnIndex(columnsDetails.length, !!displayIndexColumn);
    columnGroupRef.replaceChild(newFirstCols, firstCols);
  }

  public static create(dataCellColors: CellStateColorsR) {
    const colGroup = document.createElement('colgroup');
    // the first col needs to span all of the columns except the add new column
    const dataColumnsCol = document.createElement('col');
    // the second col needs to span only the add new column
    const addColumnCol = document.createElement('col');
    addColumnCol.span = 1;
    addColumnCol.style.backgroundColor = dataCellColors.default.backgroundColor; // REF-17
    colGroup.appendChild(dataColumnsCol);
    colGroup.appendChild(addColumnCol);
    return colGroup;
  }
}
