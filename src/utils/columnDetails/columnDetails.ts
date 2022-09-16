import {ColumnDetailsT, ColumnDetailsTPartial, ColumnSizerStateT} from '../../types/columnDetails';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement): ColumnDetailsTPartial {
    return {elements: [cellElement]};
  }

  public static create(cellElement: HTMLElement, columnSizer: ColumnSizerStateT): ColumnDetailsT {
    return {elements: [cellElement], columnSizer};
  }
}
