import {FilterRowsInputElement} from '../../../../elements/filter/rows/input/filterRowsInputElement';
import {FilterRowsInputEvents} from '../../../../elements/filter/rows/input/filterRowsInputEvents';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {CellElement} from '../../../../elements/cell/cellElement';
import {ColumnsDetailsT} from '../../../../types/columnDetails';
import {FilterRowsViaPromises} from './filterRowsViaPromises';
import {FilterRowsConfig} from '../../../../types/filterRows';
import {TableContent} from '../../../../types/tableContent';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInternalUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc() {
    return window.Worker
      ? FilterRowsViaWebWorkers.execute.bind(this, FilterRowsViaWebWorkers.createWorkerBlobURL())
      : FilterRowsViaPromises.execute;
  }

  public static generateDefaultHeaderName(content: TableContent, defaultColumnHeaderName?: string) {
    if (defaultColumnHeaderName) {
      const headerExists = content[0]?.find((headerName) => headerName === defaultColumnHeaderName);
      if (headerExists) return defaultColumnHeaderName;
    }
    return content[0]?.[0] !== undefined ? String(content[0]?.[0]) : '';
  }

  public static addConfig(at: ActiveTable, userConfig: FilterRowsConfig) {
    const {placeholderTemplate, defaultColumnHeaderName} = userConfig;
    // other values are added later
    const internalConfig = {
      isCaseSensitive: false,
      placeholderTemplate,
      defaultColumnHeaderName,
    } as FilterRowsInternalConfig;
    at._filterInternal.rows ??= [];
    at._filterInternal.rows.push(internalConfig);
    return internalConfig;
  }

  // colElements are used to identify active column (not using name as columns can have same names)
  // prettier-ignore
  private static assignElements(content: TableContent,
      columnsDetails: ColumnsDetailsT, rowConfig: FilterRowsInternalConfig, colElements?: HTMLElement[]) {
    if (content.length === 0) return;
    if (rowConfig.defaultColumnHeaderName) {
      const columnIndex = content[0].findIndex((headerName) => headerName === rowConfig.defaultColumnHeaderName);
      rowConfig.elements = columnsDetails[columnIndex === -1 ? 0 : columnIndex].elements;
      delete rowConfig.defaultColumnHeaderName;
    } else if (colElements) {
      rowConfig.elements = colElements;
    } else{
      rowConfig.elements = columnsDetails[0].elements;
    }
  }

  // prettier-ignore
  public static resetInput(at: ActiveTable, config: FilterRowsInternalConfig, colElements?: HTMLElement[]) {
    const {content, _columnsDetails, _filterInternal: {rows}} = at;
    if (!rows) return;
    FilterRowsInternalUtils.assignElements(content, _columnsDetails, config, colElements);
    const headerName = CellElement.getText(config.elements[0]);
    FilterRowsInputElement.setPlaceholder(config.inputElement, headerName, config.placeholderTemplate);
    FilterRowsInputEvents.setEvents(config, rows);
  }

  // prettier-ignore
  public static resetAllInputs(at: ActiveTable) {
    const {content, _filterInternal: {rows}} = at;
    if (!content[0] || content[0].length === 0 || !rows) return FilterRowsInputEvents.unsetEvents(rows);
    rows.forEach((rowConfig) => FilterRowsInternalUtils.resetInput(at, rowConfig));
  }
}
