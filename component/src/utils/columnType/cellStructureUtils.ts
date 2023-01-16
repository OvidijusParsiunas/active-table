import {ActiveTable} from '../../activeTable';

// the reason why columnIndex comes before rowIndex is because rowIndex is not required for all structures
type SetStructure = (at: ActiveTable, cellElement: HTMLElement, columnIndex: number, rowIndex: number) => void;

type SetEvents = (at: ActiveTable, cellElement: HTMLElement, rowIndex: number, columnIndex: number) => void;

export class CellStructureUtils {
  public static setColumn(at: ActiveTable, columnIndex: number, setStructure: SetStructure, setEvents: SetEvents) {
    const {elements} = at.columnsDetails[columnIndex];
    elements.slice(1).forEach((cellElement: HTMLElement, dataRowIndex: number) => {
      const relativeRowIndex = dataRowIndex + 1;
      setStructure(at, cellElement, columnIndex, relativeRowIndex);
      // event setter should not be in a timeout because if column width is wide and column type dropdown is closed
      // after the user selected a new type, if mouse is on the same column - mouse enter event will be fired
      if (at.columnsDetails[columnIndex].settings.isCellTextEditable) {
        setEvents(at, cellElement, relativeRowIndex, columnIndex);
      }
    });
  }
}
