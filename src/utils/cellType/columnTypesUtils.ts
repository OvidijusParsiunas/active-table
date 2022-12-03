import {ColumnTypes} from '../../types/columnTypes';
import {CellText} from '../../types/tableContents';

export class ColumnTypesUtils {
  public static getDefault(): ColumnTypes {
    return [
      {
        name: 'Number2',
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: {
          ascending: (cellText1: CellText, cellText2: CellText) => (cellText1 as number) - (cellText2 as number),
          descending: (cellText1: CellText, cellText2: CellText) => (cellText2 as number) - (cellText1 as number),
        },
      },
    ];
  }
}
