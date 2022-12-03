import {ColumnTypes} from '../../types/columnTypes';
import {CellText} from '../../types/tableContents';

export class ColumnTypesUtils {
  public static getDefault(): ColumnTypes {
    return [
      {
        name: 'Number2',
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: {
          ascending: (cellText1: string, cellText2: string) => Number(cellText1) - Number(cellText2),
          descending: (cellText1: string, cellText2: string) => Number(cellText2) - Number(cellText1),
        },
      },
    ];
  }
}
