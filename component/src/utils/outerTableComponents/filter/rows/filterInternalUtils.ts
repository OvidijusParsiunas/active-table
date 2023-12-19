import {PageButtonContainerElement} from '../../../../elements/pagination/pageButtons/pageButtonContainerElement';
import {FilterInputElement} from '../../../../elements/visibility/filterRows/input/filterInputElement';
import {FilterInputEvents} from '../../../../elements/visibility/filterRows/input/filterInputEvents';
import {FilterElements} from '../../../../elements/visibility/filterRows/filterElements';
import {FilterInternal} from '../../../../types/visibilityInternal';
import {CellElement} from '../../../../elements/cell/cellElement';
import {PaginationUtils} from '../../pagination/paginationUtils';
import {ColumnsDetailsT} from '../../../../types/columnDetails';
import {FilterViaWebWorkers} from './filterViaWebWorkers';
import {TableData} from '../../../../types/tableData';
import {FilterViaTimeouts} from './filterViaTimeouts';
import {ActiveTable} from '../../../../activeTable';
import {Filter} from '../../../../types/filter';

export class FilterInternalUtils {
  // IMPORTANT - only one instance of this variable exists for all components in the same browser window
  public static ACTIVE_WORKERS = 0;
  public static readonly CHUNK_SIZE = 2;
  public static readonly HIDDEN_ROW_CLASS = 'filter-hidden-row';

  private static finishFiltering(at: ActiveTable) {
    if (at.pagination) {
      PageButtonContainerElement.repopulateButtons(at);
      PaginationUtils.displayRowsForDifferentButton(at, 1);
    }
  }

  public static getFilterFunc(at: ActiveTable) {
    const finish = FilterInternalUtils.finishFiltering.bind(this, at);
    return window.Worker
      ? FilterViaWebWorkers.execute.bind(this, finish, FilterViaWebWorkers.createWorkerBlobURL())
      : FilterViaTimeouts.execute.bind(this, finish);
  }

  public static generateDefaultHeaderName(data: TableData, defaultColumnHeaderName?: string) {
    if (defaultColumnHeaderName) {
      const headerExists = data[0]?.find((headerName) => headerName === defaultColumnHeaderName);
      if (headerExists) return defaultColumnHeaderName;
    }
    return data[0]?.[0] !== undefined ? String(data[0]?.[0]) : '';
  }

  public static addConfig(at: ActiveTable, userConfig: Filter) {
    const {placeholderTemplate, defaultColumnHeaderName} = userConfig;
    // other values are added later
    const internalConfig = {
      isCaseSensitive: false,
      placeholderTemplate,
      defaultColumnHeaderName: defaultColumnHeaderName || FilterInternalUtils.generateDefaultHeaderName(at.data),
    } as FilterInternal;
    at._visiblityInternal.filters ??= [];
    at._visiblityInternal.filters.push(internalConfig);
    return internalConfig;
  }

  // colElements are used to identify active column (not using name as columns can have same names)
  private static assignElements(at: ActiveTable, rowConfig: FilterInternal) {
    const {data, _columnsDetails} = at;
    if (data.length === 0) return;
    if (rowConfig.defaultColumnHeaderName) {
      const columnIndex = data[0].findIndex((headerName) => headerName === rowConfig.defaultColumnHeaderName);
      rowConfig.elements = _columnsDetails[columnIndex === -1 ? 0 : columnIndex].elements;
      delete rowConfig.defaultColumnHeaderName;
      // please consider that in codesandbox - upon a second refresh - elements are not there which causes no elements to
      // be assigned to rowConfig.elements, this is caught by !config.elements in method below, but be careful on this
    } else if (rowConfig.elements && !at.shadowRoot?.contains(rowConfig.elements[0])) {
      rowConfig.elements = _columnsDetails[0].elements;
    }
  }

  // prettier-ignore
  public static resetInput(at: ActiveTable, config: FilterInternal) {
    const {_visiblityInternal: {filters}} = at;
    FilterInternalUtils.assignElements(at, config);
    if (!config.elements || !filters) return;
    const headerName = CellElement.getText(config.elements[0]);
    config.lastRegisteredHeaderName = headerName;
    FilterInputElement.setPlaceholder(config.inputElement, headerName, config.placeholderTemplate);
    FilterInputEvents.setEvents(at, config, filters);
  }

  public static unsetFilter(inputElement: HTMLInputElement) {
    if (inputElement.value !== '') {
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input'));
    }
  }

  public static unsetAllFilters(at: ActiveTable) {
    let reset = false;
    const {data, _visiblityInternal, _tableBodyElementRef} = at;
    if (data[0] && data[0].length !== 0 && _tableBodyElementRef) {
      _visiblityInternal.filters?.forEach((rowConfig) => {
        if (rowConfig.inputElement.value !== '') {
          rowConfig.inputElement.value = '';
          reset = true;
        }
      });
      if (reset) _visiblityInternal.filters?.[0].inputElement.dispatchEvent(new Event('input'));
    }
    return reset;
  }

  // prettier-ignore
  public static resetAllInputs(at: ActiveTable) {
    const {data, _visiblityInternal: {filters}} = at;
    if (!data[0] || data[0].length === 0 || !filters) return FilterInputEvents.unsetEvents(filters);
    filters.forEach((config) => FilterInternalUtils.resetInput(at, config));
    FilterInternalUtils.unsetAllFilters(at);
  }

  public static completeReset(at: ActiveTable) {
    const internalFilters = at._visiblityInternal.filters;
    if (!internalFilters) return;
    if (Array.isArray(at.filter)) {
      at.filter.forEach((rowConfig, index) => {
        internalFilters[index].defaultColumnHeaderName = rowConfig.defaultColumnHeaderName;
      });
    } else if (typeof at.filter === 'object') {
      internalFilters[0].defaultColumnHeaderName = at.filter.defaultColumnHeaderName;
    }
    FilterInternalUtils.resetAllInputs(at);
  }

  public static isContainerRequired(filter: ActiveTable['filter'], containerPosition: 'top' | 'bottom') {
    let isRequired = false;
    if (Array.isArray(filter)) {
      isRequired = !!filter.find((filterConfig) => {
        const index = (filterConfig.position || FilterElements.DEFAULT_INPUT_POSITION).indexOf(containerPosition);
        return index !== undefined && index >= 0;
      });
    } else if (typeof filter === 'object') {
      const index = (filter.position || FilterElements.DEFAULT_INPUT_POSITION).indexOf(containerPosition);
      isRequired = index !== undefined && index >= 0;
    } else if (typeof filter === 'boolean') {
      const index = FilterElements.DEFAULT_INPUT_POSITION.indexOf(containerPosition);
      isRequired = index !== undefined && index >= 0;
    }
    return isRequired;
  }

  public static extractUnfilteredRows(tableBodyElement: HTMLElement, contentLength: number) {
    const rows = Array.from(tableBodyElement.children);
    return rows.slice(0, contentLength).filter((row) => !row.classList.contains(FilterInternalUtils.HIDDEN_ROW_CLASS));
  }

  // prettier-ignore
  public static wasHeaderChanged(
      columnsDetails: ColumnsDetailsT, rowConfigs: FilterInternal[], columnIndex: number, colRemove?: boolean) {
    const elements = columnsDetails[columnIndex].elements;
    const rowConfig = rowConfigs.find((rowConfig) => elements === rowConfig.elements);
    // if rowConfig is set - it means it was the currently edited column
    return rowConfig && (rowConfig.lastRegisteredHeaderName !== CellElement.getText(elements[0]) || colRemove);
  }
}
