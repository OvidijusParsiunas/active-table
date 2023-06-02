import {PageButtonContainerElement} from '../../../../elements/pagination/pageButtons/pageButtonContainerElement';
import {FilterRowsInputElement} from '../../../../elements/filter/rows/input/filterRowsInputElement';
import {FilterRowsInputEvents} from '../../../../elements/filter/rows/input/filterRowsInputEvents';
import {FilterRowsElements} from '../../../../elements/filter/rows/filterRowsElements';
import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {CellElement} from '../../../../elements/cell/cellElement';
import {PaginationUtils} from '../../pagination/paginationUtils';
import {FilterRowsViaTimeouts} from './filterRowsViaTimeouts';
import {FilterRowsConfig} from '../../../../types/filterRows';
import {TableContent} from '../../../../types/tableContent';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInternalUtils {
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
    const finish = FilterRowsInternalUtils.finishFiltering.bind(this, at);
    return window.Worker
      ? FilterRowsViaWebWorkers.execute.bind(this, finish, FilterRowsViaWebWorkers.createWorkerBlobURL())
      : FilterRowsViaTimeouts.execute.bind(this, finish);
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
  private static assignElements(at: ActiveTable, rowConfig: FilterRowsInternalConfig) {
    const {content, _columnsDetails} = at;
    if (content.length === 0) return;
    if (rowConfig.defaultColumnHeaderName) {
      const columnIndex = content[0].findIndex((headerName) => headerName === rowConfig.defaultColumnHeaderName);
      rowConfig.elements = _columnsDetails[columnIndex === -1 ? 0 : columnIndex].elements;
      delete rowConfig.defaultColumnHeaderName;
    } else if (rowConfig.elements && !at.shadowRoot?.contains(rowConfig.elements[0])) {
      rowConfig.elements = _columnsDetails[0].elements;
    }
  }

  // prettier-ignore
  public static resetInput(at: ActiveTable, config: FilterRowsInternalConfig) {
    const {_filterInternal: {rows}} = at;
    if (!rows) return;
    FilterRowsInternalUtils.assignElements(at, config);
    const headerName = CellElement.getText(config.elements[0]);
    FilterRowsInputElement.setPlaceholder(config.inputElement, headerName, config.placeholderTemplate);
    FilterRowsInputEvents.setEvents(at, config, rows);
  }

  // prettier-ignore
  public static resetAllInputs(at: ActiveTable) {
    const {content, _filterInternal: {rows}} = at;
    if (!content[0] || content[0].length === 0 || !rows) return FilterRowsInputEvents.unsetEvents(rows);
    rows.forEach((rowConfig) => FilterRowsInternalUtils.resetInput(at, rowConfig));
  }

  public static completeReset(at: ActiveTable) {
    const internalRows = at._filterInternal.rows;
    if (!internalRows) return;
    if (Array.isArray(at.filterRows)) {
      at.filterRows.forEach((rowConfig, index) => {
        internalRows[index].defaultColumnHeaderName = rowConfig.defaultColumnHeaderName;
      });
    } else if (typeof at.filterRows === 'object') {
      internalRows[0].defaultColumnHeaderName = at.filterRows.defaultColumnHeaderName;
    }
    FilterRowsInternalUtils.resetAllInputs(at);
  }

  public static isContainerRequired(at: ActiveTable, containerPosition: 'top' | 'bottom') {
    let isRequired = false;
    if (Array.isArray(at.filterRows)) {
      isRequired = !!at.filterRows.find((filterConfig) => {
        const index = (filterConfig.position || FilterRowsElements.DEFAULT_INPUT_POSITION).indexOf(containerPosition);
        return index !== undefined && index >= 0;
      });
    } else if (typeof at.filterRows === 'object') {
      const index = (at.filterRows.position || FilterRowsElements.DEFAULT_INPUT_POSITION).indexOf(containerPosition);
      isRequired = index !== undefined && index >= 0;
    }
    return isRequired;
  }

  public static extractUnfilteredRows(tableBodyElement: HTMLElement, contentLength: number) {
    const rows = Array.from(tableBodyElement.children);
    return rows.slice(0, contentLength).filter((row) => !row.classList.contains(FilterRowsInternalUtils.HIDDEN_ROW_CLASS));
  }
}
