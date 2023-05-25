import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsUtils';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {ActiveTable} from '../../../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterRowsInputEvents {
  // WORK - be careful about pagination
  public static setEvents(at: ActiveTable, config: FilterRowsInternalConfig) {
    const {isCaseSensitive, inputElement, activeColumnName} = config;
    if (!at.content[0] || at.content[0].length === 0) return;
    const columnIndex = at.content[0].findIndex((headerText) => headerText === activeColumnName) || 0;
    const processRows = FilterRowsInternalUtils.getFilterFunc(isCaseSensitive);
    inputElement.oninput = () => {
      const filterText = isCaseSensitive ? inputElement.value : inputElement.value.toLocaleLowerCase();
      const colCelss = at._columnsDetails[columnIndex].elements.slice(1);
      processRows(colCelss, filterText);
    };
  }
}
