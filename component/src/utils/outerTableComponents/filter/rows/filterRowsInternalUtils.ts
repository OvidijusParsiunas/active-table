import {FilterRowsInputElement} from '../../../../elements/filter/rows/input/filterRowsInputElement';
import {FilterRowsInputEvents} from '../../../../elements/filter/rows/input/filterRowsInputEvents';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
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

  private static generateActiveHeaderName(content: TableContent, defaultColumnName?: string) {
    if (defaultColumnName) {
      const headerExists = content[0]?.find((headerName) => headerName === defaultColumnName);
      if (headerExists) return defaultColumnName;
    }
    return content[0]?.[0] !== undefined ? String(content[0]?.[0]) : '';
  }

  public static addConfig(at: ActiveTable, userConfig: FilterRowsConfig) {
    const {defaultColumnHeaderName, placeholderTemplate} = userConfig;
    // other values are added later
    const internalConfig = {
      activeHeaderName: FilterRowsInternalUtils.generateActiveHeaderName(at.content, defaultColumnHeaderName),
      isCaseSensitive: false,
      placeholderTemplate,
    } as FilterRowsInternalConfig;
    at._filterInternal.rows ??= [];
    at._filterInternal.rows.push(internalConfig);
    return internalConfig;
  }

  // prettier-ignore
  private static assignElements(
    content: TableContent, columnDetails: ColumnsDetailsT, rowConfig: FilterRowsInternalConfig) {
    if (content.length === 0) return;
    const columnIndex = content[0].findIndex((headerText) => headerText === rowConfig.activeHeaderName) || 0;
    rowConfig.elements = columnDetails[columnIndex].elements;
  }

  // prettier-ignore
  public static resetInput(at: ActiveTable, config: FilterRowsInternalConfig) {
    const {content, _columnsDetails, _filterInternal: {rows}} = at;
    if (!rows) return;
    FilterRowsInternalUtils.assignElements(content, _columnsDetails, config);
    FilterRowsInputElement.setPlaceholder(config.inputElement, config.activeHeaderName, config.placeholderTemplate);
    FilterRowsInputEvents.setEvents(config, rows);
  }

  // prettier-ignore
  public static resetAllInputs(at: ActiveTable) {
    const {content, _filterInternal: {rows}} = at;
    if (!content[0] || content[0].length === 0 || !rows) return FilterRowsInputEvents.unsetEvents(rows);
    rows.forEach((rowConfig) => FilterRowsInternalUtils.resetInput(at, rowConfig));
  }
}
