import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {FilterRowsViaPromises} from './filterRowsViaPromises';
import {TableContent} from '../../../../types/tableContent';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInternalUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc(isCaseSensitive: boolean) {
    return window.Worker
      ? FilterRowsViaWebWorkers.filter.bind(this, FilterRowsViaWebWorkers.createWorkerBlobURL(isCaseSensitive))
      : FilterRowsViaPromises.filter.bind(this, isCaseSensitive);
  }

  private static generateActiveColumnName(content: TableContent, defaultColumnName?: string) {
    if (defaultColumnName) {
      const headerExists = content[0]?.find((headerName) => headerName === defaultColumnName);
      if (headerExists) return defaultColumnName;
    }
    return content[0]?.[0] !== undefined ? String(content[0]?.[0]) : '';
  }

  public static generateConfig(at: ActiveTable, defaultColumnName?: string) {
    const activeColumnName = FilterRowsInternalUtils.generateActiveColumnName(at.content, defaultColumnName);
    const config = {activeColumnName, isCaseSensitive: false} as FilterRowsInternalConfig; // inputElement is added later
    at._filterInternal.rows ??= [];
    at._filterInternal.rows.push(config);
    return config;
  }
}
