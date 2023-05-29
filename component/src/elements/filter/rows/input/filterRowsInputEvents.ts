import {FilterRowsInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterRowsInternalUtils';
import {ChunkFilterData, FilterRowsInternalConfig, InputFilterData} from '../../../../types/filterInternal';

// WORK - filter when header is data too
// WORK - ability to filter by header name or by column index
// WORK - ability to toggle if case senseitive
export class FilterRowsInputEvents {
  public static unsetEvents(rowConfigs?: FilterRowsInternalConfig[]) {
    if (rowConfigs) rowConfigs.forEach((rowConfig) => (rowConfig.inputElement.oninput = () => {}));
  }

  private static updateSameInputValues(otherConfigs: FilterRowsInternalConfig[], currentConfig: FilterRowsInternalConfig) {
    otherConfigs.forEach((otherRowConfig) => {
      if (otherRowConfig.elements === currentConfig.elements) {
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
    const filterableInputs = inputsData.filter((inputData) => inputData.filterText !== '');
    if (filterableInputs.length === 0) filterableInputs.push(inputsData[0]); // still need to do first to toggle all rows
    const numWorkers = Math.ceil(filterableInputs[0].colCells.length / FilterRowsInternalUtils.CHUNK_SIZE);
    for (let i = 0; i < numWorkers; i += 1) {
      const chunkIndex = i * FilterRowsInternalUtils.CHUNK_SIZE;
      const chunkData = filterableInputs.map((data) => {
        const chunkData = data as ChunkFilterData;
        chunkData.chunk = data.colCells.slice(chunkIndex, chunkIndex + FilterRowsInternalUtils.CHUNK_SIZE);
        return chunkData;
      });
      execFunc(chunkData); // REF-42
    }
  }

  // WORK - be careful about pagination
  public static setEvents(currentConfig: FilterRowsInternalConfig, allConfigs: FilterRowsInternalConfig[]) {
    if (!currentConfig.elements) return; // elements not present when initialised with no content
    const filterFunc = FilterRowsInternalUtils.getFilterFunc();
    const otherRowConfigs = allConfigs.filter((rowConfig) => rowConfig !== currentConfig);
    currentConfig.inputElement.oninput = () => {
      // update is done synchronously for evaluated inputs to have the same input value
      FilterRowsInputEvents.updateSameInputValues(otherRowConfigs, currentConfig);
      FilterRowsInputEvents.splitChunksAndExecute(FilterRowsInputEvents.getFilterData(allConfigs), filterFunc);
    };
  }
}
