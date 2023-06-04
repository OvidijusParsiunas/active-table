import {ChunkFilterData} from '../../../../types/visibilityInternal';
import {CellElement} from '../../../../elements/cell/cellElement';
import {FilterInternalUtils} from './filterInternalUtils';

// REF-42
export class FilterViaTimeouts {
  private static processOtherColumnsIfPresent(finish: () => void, chunksData: ChunkFilterData[], indexes: number[]) {
    FilterInternalUtils.ACTIVE_WORKERS -= 1;
    if (chunksData.length > 1 && indexes.length > 0) {
      FilterViaTimeouts.processOtherColumns(finish, chunksData.slice(1), indexes);
    } else if (FilterInternalUtils.ACTIVE_WORKERS === 0) {
      finish();
    }
  }

  private static toggleRow(cell: HTMLElement, chunkData: ChunkFilterData, matchingIndexes: number[], index: number) {
    const dataText = CellElement.getText(cell);
    const processedText = chunkData.isCaseSensitive ? dataText : dataText.toLocaleLowerCase();
    const doesCellTextContainFilterInput = processedText.includes(chunkData.filterText);
    const row = cell.parentElement as HTMLElement;
    if (doesCellTextContainFilterInput) {
      row.classList.remove(FilterInternalUtils.HIDDEN_ROW_CLASS);
      matchingIndexes.push(index);
    } else {
      row.classList.add(FilterInternalUtils.HIDDEN_ROW_CLASS);
    }
  }

  private static processOtherColumns(finish: () => void, chunksData: ChunkFilterData[], indexes: number[]) {
    setTimeout(() => {
      FilterInternalUtils.ACTIVE_WORKERS += 1;
      const matchingIndexes: number[] = [];
      const chunkData = chunksData[0];
      indexes.forEach((index) => {
        const cell = chunkData.chunk[index];
        FilterViaTimeouts.toggleRow(cell, chunkData, matchingIndexes, index);
      });
      FilterViaTimeouts.processOtherColumnsIfPresent(finish, chunksData, matchingIndexes);
    });
  }

  public static execute(finish: () => void, chunksData: ChunkFilterData[]) {
    FilterInternalUtils.ACTIVE_WORKERS += 1;
    setTimeout(() => {
      const matchingIndexes: number[] = [];
      const chunkData = chunksData[0];
      chunkData.chunk.forEach((cell, index) => {
        FilterViaTimeouts.toggleRow(cell, chunkData, matchingIndexes, index);
      });
      FilterViaTimeouts.processOtherColumnsIfPresent(finish, chunksData, matchingIndexes);
    });
  }
}
