import {CalendarFunctionality} from '../../types/calendarFunctionality';
import {TableContents, TableRow} from '../../types/tableContents';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {CellElementIndex} from '../elements/cellElementIndex';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {CellEvents} from '../../elements/cell/cellEvents';
import {TextValidation} from '../../types/textValidation';
import {SortingFuncs} from '../../types/sortingFuncs';
import {RegexUtils} from '../regex/regexUtils';
import {ActiveTable} from '../../activeTable';

export class Sort {
  private static extractNumberFromString(text: string) {
    const numberStringArr = RegexUtils.extractFloatStrs(text);
    if (numberStringArr && numberStringArr.length > 0) {
      return Number(numberStringArr[0]);
    }
    return 0;
  }

  public static readonly DEFAULT_TYPES_SORT_FUNCS: {[key in DEFAULT_COLUMN_TYPES]?: SortingFuncs} = {
    [DEFAULT_COLUMN_TYPES.NUMBER]: {
      ascending: (cellText1: string, cellText2: string) => {
        return Number(cellText1) - Number(cellText2);
      },
      descending: (cellText1: string, cellText2: string) => Number(cellText2) - Number(cellText1),
    },
    [DEFAULT_COLUMN_TYPES.CURRENCY]: {
      ascending: (cellText1: string, cellText2: string) => {
        return Sort.extractNumberFromString(cellText1) - Sort.extractNumberFromString(cellText2);
      },
      descending: (cellText1: string, cellText2: string) => {
        return Sort.extractNumberFromString(cellText2) - Sort.extractNumberFromString(cellText1);
      },
    },
  };

  // cannot safely identify if nothing has been changed, hence need to send out an update for all cells
  // prettier-ignore
  private static update(at: ActiveTable, sortedDataContents: TableContents) {
    const {tableBodyElementRef, auxiliaryTableContentInternal: {displayIndexColumn}, contents, onTableUpdate} = at;
    const rowElements = (tableBodyElementRef as HTMLElement).children;
    sortedDataContents.forEach((row, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      const rowChildren = rowElements[relativeRowIndex].children;
      row.forEach((cell, columnIndex) => {
        const elementColumnIndex = CellElementIndex.getViaColumnIndex(columnIndex, !!displayIndexColumn);
        // the reason why updateContents property is set to false is because we do not want to overwrite contents array
        // cells as their row references are still the same with the sortedDataContents, hence upon attempting to
        // overwrite the contents array cells, sortedDataContents cells are also overwritten. This is problematic because
        // sortedDataContents rows are in a different order, hence the cells to be traversed can already be overwritten
        // by the earlier cells
        CellEvents.updateCell(at, cell as string, relativeRowIndex, columnIndex,
          { processText: false, element: rowChildren[elementColumnIndex] as HTMLElement,
            updateTableEvent: false, updateContents: false });
      });
    });
    contents.splice(1, sortedDataContents.length, ...sortedDataContents);
    onTableUpdate(contents);
  }

  private static sortStringsColumnAscending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => String(a[columnIndex]).localeCompare(String(b[columnIndex])));
  }

  private static sortStringsColumnDescending(contents: TableContents, columnIndex: number) {
    contents.sort((a: TableRow, b: TableRow) => String(b[columnIndex]).localeCompare(String(a[columnIndex])));
  }

  private static sortStrings(dataContents: TableContents, columnIndex: number, isAsc: boolean) {
    if (isAsc) {
      Sort.sortStringsColumnAscending(dataContents, columnIndex);
    } else {
      Sort.sortStringsColumnDescending(dataContents, columnIndex);
    }
  }

  // prettier-ignore
  private static parseComparedText<T>(cellText1: string, cellText2: string,
      isAsc: boolean, parse: (cellText: string) => T | undefined) {
    // the number result follows JavaScript's sort standard that will cause incorrect text to move to the bottom
    const parsedCellText1 = parse(cellText1);
    if (parsedCellText1 === undefined) return isAsc ? 1 : -1;
    const parsedCellText2 = parse(cellText2);
    if (parsedCellText2 === undefined) return isAsc ? -1 : 1;
    return [parsedCellText1, parsedCellText2];
  }

  private static validateType(validate: TextValidation['func'], cellText: string) {
    return validate === undefined || validate(cellText) ? cellText : undefined;
  }

  // prettier-ignore
  private static validateAndSort(cellText1: string, cellText2: string, sortFunc: SortingFuncs[keyof SortingFuncs],
      validate: TextValidation['func'], isAsc: boolean) {
    const parseResult = Sort.parseComparedText(cellText1, cellText2, isAsc, Sort.validateType.bind(this, validate));
    if (typeof parseResult === 'number') return parseResult;
    return sortFunc(parseResult[0], parseResult[1]);
  }

  private static sortViaSortFuncs(type: ColumnTypeInternal, dataContent: TableContents, colIndex: number, isAsc: boolean) {
    const {sorting, textValidation} = type;
    if (!sorting) return;
    if (isAsc) {
      dataContent.sort((a: TableRow, b: TableRow) =>
        Sort.validateAndSort(a[colIndex] as string, b[colIndex] as string, sorting.ascending, textValidation.func, isAsc)
      );
    } else {
      dataContent.sort((a: TableRow, b: TableRow) =>
        Sort.validateAndSort(b[colIndex] as string, a[colIndex] as string, sorting.descending, textValidation.func, isAsc)
      );
    }
  }

  private static compareDates(ymd1: [number], ymd2: [number]) {
    return (new Date(...ymd1) as unknown as number) - (new Date(...ymd2) as unknown as number);
  }

  private static parseYMDFormat(validate: TextValidation['func'], calendar: CalendarFunctionality, cellText: string) {
    const isValid = Sort.validateType(validate, cellText);
    return isValid ? (calendar.toYMD(cellText) as unknown as [number]) : undefined;
  }

  // prettier-ignore
  private static sortDates(type: ColumnTypeInternal, dataContents: TableContents, columnIndex: number, isAsc: boolean) {
    const {calendar, textValidation} = type;
    if (!calendar) return;
    dataContents.sort((a: TableRow, b: TableRow) => {
      // isAsc param is always true because the order at which we pass in text is always the same as the asc sort
      const parseResult = Sort.parseComparedText(a[columnIndex] as string, b[columnIndex] as string, true,
        Sort.parseYMDFormat.bind(this, textValidation.func, calendar)); 
      if (typeof parseResult === 'number') return parseResult;
      return isAsc
        ? Sort.compareDates(parseResult[0], parseResult[1])
        : Sort.compareDates(parseResult[1], parseResult[0]);
    });
  }

  public static sortContentsColumn(at: ActiveTable, columnIndex: number, isAsc: boolean) {
    const dataContents = at.contents.slice(1);
    const {activeType} = at.columnsDetails[columnIndex];
    if (activeType.calendar) {
      Sort.sortDates(activeType, dataContents, columnIndex, isAsc);
    } else if (activeType.sorting) {
      Sort.sortViaSortFuncs(activeType, dataContents, columnIndex, isAsc);
    } else {
      Sort.sortStrings(dataContents, columnIndex, isAsc);
    }
    Sort.update(at, dataContents);
  }
}
