import {CellElement} from '../../../../elements/cell/cellElement';
import {ChunkFilterData} from '../../../../types/filterInternal';

export class FilterRowsViaPromises {
  private static processOtherColumnsIfPresent(chunksData: ChunkFilterData[], matchingIndexes: number[]) {
    if (chunksData.length > 1 && matchingIndexes.length > 0) {
      FilterRowsViaPromises.processOtherColumns(chunksData.slice(1), matchingIndexes);
    }
  }

  private static toggleRow(cell: HTMLElement, chunkData: ChunkFilterData, matchingIndexes: number[], index: number) {
    const dataText = CellElement.getText(cell);
    const processedText = chunkData.isCaseSensitive ? dataText : dataText.toLocaleLowerCase();
    const doesCellTextContainFilterInput = processedText.includes(chunkData.filterText);
    const row = cell.parentElement as HTMLElement;
    if (doesCellTextContainFilterInput) {
      row.style.display = '';
      matchingIndexes.push(index);
    } else {
      row.style.display = 'none';
    }
  }

  private static processOtherColumns(chunksData: ChunkFilterData[], indexes: number[]) {
    new Promise(() => {
      const matchingIndexes: number[] = [];
      const chunkData = chunksData[0];
      indexes.forEach((index) => {
        const cell = chunkData.chunk[index];
        FilterRowsViaPromises.toggleRow(cell, chunkData, matchingIndexes, index);
      });
      FilterRowsViaPromises.processOtherColumnsIfPresent(chunksData, matchingIndexes);
    });
  }

  public static execute(chunksData: ChunkFilterData[]) {
    new Promise(() => {
      const matchingIndexes: number[] = [];
      const chunkData = chunksData[0];
      chunkData.chunk.forEach((cell, index) => {
        FilterRowsViaPromises.toggleRow(cell, chunkData, matchingIndexes, index);
      });
      FilterRowsViaPromises.processOtherColumnsIfPresent(chunksData, matchingIndexes);
    });
  }
}
