import {EditableTableComponent} from '../../editable-table-component';

// the reason why columnIndex comes before rowIndex is because rowIndex is not required for all structures
type SetStructure = (etc: EditableTableComponent, cellElement: HTMLElement, columnIndex: number, rowIndex: number) => void;

type SetEvents = (etc: EditableTableComponent, cellElement: HTMLElement, rowIndex: number, columnIndex: number) => void;

export class CellStructureUtils {
  // prettier-ignore
  public static setColumn(etc: EditableTableComponent, columnIndex: number, setStructure: SetStructure,
      setEvents: SetEvents) {
    const {elements} = etc.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataRowIndex: number) => {
      const relativeRowIndex = dataRowIndex + 1;
      setStructure(etc, cellElement, columnIndex, relativeRowIndex);
      setTimeout(() => {
        const {isCellTextEditable} = etc.columnsDetails[columnIndex].settings
        if (isCellTextEditable) setEvents(etc, cellElement, relativeRowIndex, columnIndex);
      });
    });
  }
}
