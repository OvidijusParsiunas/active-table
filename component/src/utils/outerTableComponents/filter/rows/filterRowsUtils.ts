import {FilterRowsInternalConfig} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {ColumnsDetailsT} from '../../../../types/columnDetails';
import {FilterRowsViaPromises} from './filterRowsViaPromises';
import {TableContent} from '../../../../types/tableContent';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInternalUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc() {
    return window.Worker
      ? FilterRowsViaWebWorkers.execute.bind(this, FilterRowsViaWebWorkers.createWorkerBlobURL())
      : FilterRowsViaPromises.execute;
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

  // prettier-ignore
  public static assignElements(
      content: TableContent, columnDetails: ColumnsDetailsT, rowConfigs: FilterRowsInternalConfig[]) {
    rowConfigs.forEach((rowConfig) => {
      const columnIndex = content[0].findIndex((headerText) => headerText === rowConfig.activeColumnName) || 0;
      rowConfig.elements = columnDetails[columnIndex].elements;
  });
}
}
