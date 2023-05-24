import {FilterRowsInternal} from '../../../../types/filterInternal';
import {FilterRowsViaWebWorkers} from './filterRowsViaWebWorkers';
import {FilterRowsViaPromises} from './filterRowsViaPromises';
import {ActiveTable} from '../../../../activeTable';

export class FilterRowsInternalUtils {
  public static readonly CHUNK_SIZE = 2;

  public static getFilterFunc(isCaseSensitive: boolean) {
    return window.Worker
      ? FilterRowsViaWebWorkers.filter.bind(this, FilterRowsViaWebWorkers.createWorkerBlobURL(isCaseSensitive))
      : FilterRowsViaPromises.filter.bind(this, isCaseSensitive);
  }

  public static process(at: ActiveTable) {
    const activeColumnName = at.content[0]?.[0] ? String(at.content[0]?.[0]) : '';
    at._filterInternal.rows = {activeColumnName, isCaseSensitive: false} as FilterRowsInternal;
  }
}
