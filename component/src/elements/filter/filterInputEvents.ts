import {ExtractElements} from '../../utils/elements/extractElements';
import {ActiveTable} from '../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
export class FilterInputEvents {
  private static toggleRowBasedOnFilter(rowElement: HTMLElement, filterText: string, columnIndex: number) {
    const cellText = rowElement.children[columnIndex];
    const cellTextL = (cellText.textContent as string).toLocaleLowerCase();
    const doesCellTextContainFilterInput = cellTextL.includes(filterText);
    rowElement.style.display = doesCellTextContainFilterInput ? '' : 'none';
  }

  // WORK - be careful about pagination
  public static setEvents(at: ActiveTable, inputElement: HTMLInputElement, columnIndex: number) {
    const {_tableBodyElementRef, content} = at;
    inputElement.oninput = () => {
      const filterText = inputElement.value.toLocaleLowerCase();
      const dataRows = ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, content).slice(1);
      dataRows.forEach((rowElement) => {
        FilterInputEvents.toggleRowBasedOnFilter(rowElement as HTMLElement, filterText, columnIndex);
      });
    };
  }
}
