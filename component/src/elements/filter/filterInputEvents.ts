import {RowFilterUtils} from '../../utils/filter/rows/rowFilterUtils';
import {ExtractElements} from '../../utils/elements/extractElements';
import {ActiveTable} from '../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterInputEvents {
  // WORK - be careful about pagination
  public static setEvents(at: ActiveTable, inputElement: HTMLInputElement, columnIndex: number) {
    const {_tableBodyElementRef, content} = at;
    const processRows = RowFilterUtils.getFilterFunc();
    inputElement.oninput = () => {
      const filterText = inputElement.value.toLocaleLowerCase();
      const dataRows = ExtractElements.textRowsArrFromTBody(_tableBodyElementRef as HTMLElement, content).slice(1);
      processRows(dataRows, filterText, columnIndex);
    };
  }
}
