import {CellElement} from '../../../../elements/cell/cellElement';
import {FilterRowsInternalUtils} from './filterRowsInternalUtils';
import {ChunkFilterData} from '../../../../types/filterInternal';

// REF-42
export class FilterRowsViaPromises {
  private static processOtherColumnsIfPresent(finish: () => void, chunksData: ChunkFilterData[], indexes: number[]) {
    FilterRowsInternalUtils.ACTIVE_WORKERS -= 1;
    if (chunksData.length > 1 && indexes.length > 0) {
      FilterRowsViaPromises.processOtherColumns(finish, chunksData.slice(1), indexes);
    } else if (FilterRowsInternalUtils.ACTIVE_WORKERS === 0) {
      finish();
    }
  }

  private static toggleRow(cell: HTMLElement, chunkData: ChunkFilterData, matchingIndexes: number[], index: number) {
    const dataText = CellElement.getText(cell);
    const processedText = chunkData.isCaseSensitive ? dataText : dataText.toLocaleLowerCase();
    const doesCellTextContainFilterInput = processedText.includes(chunkData.filterText);
    const row = cell.parentElement as HTMLElement;
    if (doesCellTextContainFilterInput) {
      row.classList.remove(FilterRowsInternalUtils.HIDDEN_ROW_CLASS);
      matchingIndexes.push(index);
    } else {
      row.classList.add(FilterRowsInternalUtils.HIDDEN_ROW_CLASS);
    }
  }

  private static processOtherColumns(finish: () => void, chunksData: ChunkFilterData[], indexes: number[]) {
    new Promise(() => {
      FilterRowsInternalUtils.ACTIVE_WORKERS += 1;
      const matchingIndexes: number[] = [];
      const chunkData = chunksData[0];
      indexes.forEach((index) => {
        const cell = chunkData.chunk[index];
        FilterRowsViaPromises.toggleRow(cell, chunkData, matchingIndexes, index);
      });
      FilterRowsViaPromises.processOtherColumnsIfPresent(finish, chunksData, matchingIndexes);
    });
  }

  public static execute(finish: () => void, chunksData: ChunkFilterData[]) {
    FilterRowsInternalUtils.ACTIVE_WORKERS += 1;
    new Promise(() => {
      setTimeout(() => {
        const matchingIndexes: number[] = [];
        const chunkData = chunksData[0];
        chunkData.chunk.forEach((cell, index) => {
          FilterRowsViaPromises.toggleRow(cell, chunkData, matchingIndexes, index);
        });
        FilterRowsViaPromises.processOtherColumnsIfPresent(finish, chunksData, matchingIndexes);
      });
    });
  }
}
