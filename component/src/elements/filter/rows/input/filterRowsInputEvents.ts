import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsUtils';
import {FilterRowsInternal} from '../../../../types/filterInternal';
import {ActiveTable} from '../../../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterRowsInputEvents {
  // WORK - be careful about pagination
  // prettier-ignore
  public static setEvents(at: ActiveTable) {
    const {content, _filterInternal: {rows}, _columnsDetails} = at;
    const {isCaseSensitive, inputElement, activeColumnName} = rows as FilterRowsInternal;
    const columnIndex = content[0]?.findIndex((headerText) => headerText === activeColumnName);
    if (columnIndex === undefined) return;
    const processRows = FilterRowsInternalUtils.getFilterFunc(isCaseSensitive);
    inputElement.oninput = () => {
      const filterText = isCaseSensitive ? inputElement.value : inputElement.value.toLocaleLowerCase();
      const colCelss = _columnsDetails[columnIndex].elements.slice(1);
      processRows(colCelss, filterText);
    };
  }
}
