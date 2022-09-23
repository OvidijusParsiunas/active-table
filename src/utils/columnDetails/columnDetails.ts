import {ColumnDetailsTPartial} from '../../types/columnDetails';
import {COLUMN_TYPE} from '../../enums/columnTypes';

export class ColumnDetails {
  public static createPartial(cellElement: HTMLElement): ColumnDetailsTPartial {
    return {elements: [cellElement], type: COLUMN_TYPE.String};
  }
}
