import {EditableTableComponent} from '../../editable-table-component';

type SetStructure = (etc: EditableTableComponent, rowIndex: number, columnIndex: number, cellElement: HTMLElement) => void;

export class CellStructureUtils {
  public static set(etc: EditableTableComponent, columnIndex: number, setStructure: SetStructure) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataRowIndex: number) => {
      const relativeRowIndex = dataRowIndex + 1;
      setStructure(etc, relativeRowIndex, columnIndex, cellElement);
    });
  }
}
