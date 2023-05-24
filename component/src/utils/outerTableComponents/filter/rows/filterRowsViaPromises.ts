import {CellElement} from '../../../../elements/cell/cellElement';
import {FilterRowsInternalUtils} from './filterRowsUtils';

export class FilterRowsViaPromises {
  private static processString(chunk: HTMLElement[], filterText: string, isCaseSensitive?: boolean) {
    new Promise((resolve) => {
      chunk.forEach((cell) => {
        const dataText = CellElement.getText(cell);
        const processedText = isCaseSensitive ? dataText : dataText.toLocaleLowerCase();
        const doesCellTextContainFilterInput = processedText.includes(filterText);
        const row = cell.parentElement as HTMLElement;
        row.style.display = doesCellTextContainFilterInput ? '' : 'none';
      });
      resolve(true);
    });
  }

  public static filter(isCaseSensitive: boolean, colCells: HTMLElement[], filterText: string) {
    for (let i = 0; i < colCells.length / FilterRowsInternalUtils.CHUNK_SIZE; i += 1) {
      const chunkIndex = i * FilterRowsInternalUtils.CHUNK_SIZE;
      const chunk = colCells.slice(chunkIndex, chunkIndex + FilterRowsInternalUtils.CHUNK_SIZE);
      FilterRowsViaPromises.processString(chunk, filterText, isCaseSensitive);
    }
  }
}
