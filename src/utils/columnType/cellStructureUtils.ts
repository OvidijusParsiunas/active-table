import {EditableTableComponent} from '../../editable-table-component';

type SetStructure = (etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) => void;

export class CellStructureUtils {
  public static setColumn(etc: EditableTableComponent, columnIndex: number, setStructure: SetStructure) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataRowIndex: number) => {
      const relativeRowIndex = dataRowIndex + 1;
      setStructure(etc, cellElement, relativeRowIndex, columnIndex);
    });
  }
}
