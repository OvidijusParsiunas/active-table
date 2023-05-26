import {ChunkFilterData, FilterRowsInternalConfig, InputFilterData} from '../../../../types/filterInternal';
import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsUtils';
import {ActiveTable} from '../../../../activeTable';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterRowsInputEvents {
  private static unsetEvents(rowConfigs?: FilterRowsInternalConfig[]) {
    if (rowConfigs) rowConfigs.forEach((rowConfig) => (rowConfig.inputElement.oninput = () => {}));
  }

  private static updateSameInputValues(otherConfigs: FilterRowsInternalConfig[], currentConfig: FilterRowsInternalConfig) {
    otherConfigs.forEach((otherRowConfig) => {
      if (otherRowConfig.activeColumnName === currentConfig.activeColumnName) {
        otherRowConfig.inputElement.value = currentConfig.inputElement.value;
      }
    });
  }

  private static getFilterData(rowConfigs: FilterRowsInternalConfig[]): InputFilterData[] {
    return rowConfigs.map((config) => ({
      filterText: config.isCaseSensitive ? config.inputElement.value : config.inputElement.value.toLocaleLowerCase(),
      colCells: config.elements.slice(1),
      isCaseSensitive: config.isCaseSensitive,
    }));
  }

  private static splitChunksAndExecute(inputsData: InputFilterData[], execFunc: (chunksData: ChunkFilterData[]) => void) {
    const numWorkers = Math.ceil(inputsData[0].colCells.length / FilterRowsInternalUtils.CHUNK_SIZE);
    for (let i = 0; i < numWorkers; i += 1) {
      const chunkIndex = i * FilterRowsInternalUtils.CHUNK_SIZE;
      const chunkData = inputsData.map((data) => {
        const chunkData = data as ChunkFilterData;
        chunkData.chunk = data.colCells.slice(chunkIndex, chunkIndex + FilterRowsInternalUtils.CHUNK_SIZE);
        return chunkData;
      });
      execFunc(chunkData);
    }
  }

  // WORK - be careful about pagination
  // prettier-ignore
  public static setEvents(at: ActiveTable, config: FilterRowsInternalConfig) {
    const {content, _columnsDetails, _filterInternal: {rows}} = at;
    if (!content[0] || content[0].length === 0 || !rows) return FilterRowsInputEvents.unsetEvents(rows);
    FilterRowsInternalUtils.assignElements(content, _columnsDetails, [config]);
    const filterFunc = FilterRowsInternalUtils.getFilterFunc();
    const otherRowConfigs = rows.filter((rowConfig) => rowConfig !== config);
    config.inputElement.oninput = () => {
      FilterRowsInputEvents.splitChunksAndExecute(FilterRowsInputEvents.getFilterData(rows), filterFunc);
      setTimeout(() => FilterRowsInputEvents.updateSameInputValues(otherRowConfigs, config));
    };
  }

  // prettier-ignore
  public static setEventsForAllInputs(at: ActiveTable) {
    const {content, _filterInternal: {rows}} = at;
    if (!content[0] || content[0].length === 0 || !rows) return FilterRowsInputEvents.unsetEvents(rows);
    rows.forEach((rowConfig) => FilterRowsInputEvents.setEvents(at, rowConfig));
  }
}
