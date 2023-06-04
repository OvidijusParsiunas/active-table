import {FilterInternalUtils} from '../../../../utils/outerTableComponents/filter/rows/filterInternalUtils';
import {ChunkFilterData, FilterInternal, InputFilterData} from '../../../../types/visibilityInternal';
import {ActiveTable} from '../../../../activeTable';

export class FilterInputEvents {
  public static unsetEvents(rowConfigs?: FilterInternal[]) {
    if (rowConfigs) rowConfigs.forEach((rowConfig) => (rowConfig.inputElement.oninput = () => {}));
  }

  private static updateSameInputValues(otherConfigs: FilterInternal[], currentConfig: FilterInternal) {
    otherConfigs.forEach((otherRowConfig) => {
      if (otherRowConfig.elements === currentConfig.elements) {
        otherRowConfig.inputElement.value = currentConfig.inputElement.value;
      }
    });
  }

  private static getFilterData(rowConfigs: FilterInternal[]): InputFilterData[] {
    return rowConfigs.map((config) => ({
      filterText: config.isCaseSensitive ? config.inputElement.value : config.inputElement.value.toLocaleLowerCase(),
      colCells: config.elements.slice(1),
      isCaseSensitive: config.isCaseSensitive,
    }));
  }

  private static splitChunksAndExecute(inputsData: InputFilterData[], execFunc: (chunksData: ChunkFilterData[]) => void) {
    const filterableInputs = inputsData.filter((inputData) => inputData.filterText !== '');
    if (filterableInputs.length === 0) filterableInputs.push(inputsData[0]); // still need to do first to toggle all rows
    const numWorkers = Math.ceil(filterableInputs[0].colCells.length / FilterInternalUtils.CHUNK_SIZE);
    for (let i = 0; i < numWorkers; i += 1) {
      const chunkIndex = i * FilterInternalUtils.CHUNK_SIZE;
      const chunkData = filterableInputs.map((data) => {
        return {...data, chunk: data.colCells.slice(chunkIndex, chunkIndex + FilterInternalUtils.CHUNK_SIZE)};
      });
      execFunc(chunkData); // REF-42
    }
  }

  public static setEvents(at: ActiveTable, currentConf: FilterInternal, allConfigs: FilterInternal[]) {
    if (!currentConf.elements) return; // elements not present when initialised with no content
    const filterFunc = FilterInternalUtils.getFilterFunc(at);
    const otherRowConfigs = allConfigs.filter((rowConfig) => rowConfig !== currentConf);
    currentConf.inputElement.oninput = () => {
      // update is done synchronously for evaluated inputs to have the same input value
      FilterInputEvents.updateSameInputValues(otherRowConfigs, currentConf);
      FilterInputEvents.splitChunksAndExecute(FilterInputEvents.getFilterData(allConfigs), filterFunc);
    };
  }
}
