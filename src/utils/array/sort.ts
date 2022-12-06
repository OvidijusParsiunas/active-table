import {CalendarFunctionality} from '../../types/calendarFunctionality';
import {EditableTableComponent} from '../../editable-table-component';
import {TableContents, TableRow} from '../../types/tableContents';
import {ColumnType, SortingFuncs} from '../../types/columnType';
import {CellElementIndex} from '../elements/cellElementIndex';
import {CellEvents} from '../../elements/cell/cellEvents';

export class Sort {
  // cannot safely identify if nothing has been changed, hence need to send out an update for all cells
  // prettier-ignore
  private static update(etc: EditableTableComponent, sortedDataContents: TableContents) {
    const {tableBodyElementRef, auxiliaryTableContentInternal: {displayIndexColumn}, contents, onTableUpdate} = etc;
    const rowElements = (tableBodyElementRef as HTMLElement).children;
    sortedDataContents.forEach((row, rowIndex) => {
      const relativeRowIndex = rowIndex + 1;
      const rowChildren = rowElements[relativeRowIndex].children;
      row.forEach((cell, columnIndex) => {
        const elementColumnIndex = CellElementIndex.getViaColumnIndex(columnIndex, displayIndexColumn);
        // the reason why updateContents property is set to false is because we do not want to overwrite contents array
        // cells as their row references are still the same with the sortedDataContents, hence upon attempting to
        // overwrite the contents array cells, sortedDataContents cells are also overwritten. This is problematic because
        // sortedDataContents rows are in a different order, hence the cells to be traversed can already be overwritten
        // by the earlier cells
        CellEvents.updateCell(etc, cell as string, relativeRowIndex, columnIndex,
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
    // the number result follows JavaScript's sort standard to move incorrect text to the bottom
    const parsedCellText1 = parse(cellText1);
    if (parsedCellText1 === undefined) return isAsc ? 1 : -1;
    const parsedCellText2 = parse(cellText2);
    if (parsedCellText2 === undefined) return isAsc ? -1 : 1;
    return [parsedCellText1, parsedCellText2];
  }

  private static validateType(validation: ColumnType['validation'], cellText: string) {
    return validation === undefined || validation(cellText) ? cellText : undefined;
  }

  // prettier-ignore
  private static validateAndSort(cellText1: string, cellText2: string, sortFunc: SortingFuncs[keyof SortingFuncs],
      validation: ColumnType['validation'], isAsc: boolean) {
    const parseResult = Sort.parseComparedText(cellText1, cellText2, isAsc, Sort.validateType.bind(this, validation));
    if (typeof parseResult === 'number') return parseResult;
    return sortFunc(parseResult[0], parseResult[1]);
  }

  private static sortViaSetSortFuncs(type: ColumnType, dataContents: TableContents, columnIndex: number, isAsc: boolean) {
    const {sorting, validation} = type;
    if (!sorting) return;
    if (isAsc) {
      dataContents.sort((a: TableRow, b: TableRow) =>
        Sort.validateAndSort(a[columnIndex] as string, b[columnIndex] as string, sorting.ascending, validation, isAsc)
      );
    } else {
      dataContents.sort((a: TableRow, b: TableRow) =>
        Sort.validateAndSort(b[columnIndex] as string, a[columnIndex] as string, sorting.descending, validation, isAsc)
      );
    }
  }

  private static compareDates(ymd1: [number], ymd2: [number]) {
    return (new Date(...ymd1) as unknown as number) - (new Date(...ymd2) as unknown as number);
  }

  private static parseYMDFormat(validation: ColumnType['validation'], calendar: CalendarFunctionality, cellText: string) {
    const isValid = Sort.validateType(validation, cellText);
    return isValid ? (calendar.toYMD(cellText) as unknown as [number]) : undefined;
  }

  // prettier-ignore
  private static sortDates(type: ColumnType, dataContents: TableContents, columnIndex: number, isAsc: boolean) {
    const {calendar, validation} = type;
    if (!calendar) return;
    dataContents.sort((a: TableRow, b: TableRow) => {
      // isAsc param is always true because the order at which we pass in text is always the same as the asc sort
      const parseResult = Sort.parseComparedText(a[columnIndex] as string, b[columnIndex] as string, true,
        Sort.parseYMDFormat.bind(this, validation, calendar)); 
      if (typeof parseResult === 'number') return parseResult;
      return isAsc
        ? Sort.compareDates(parseResult[0], parseResult[1])
        : Sort.compareDates(parseResult[1], parseResult[0]);
    });
  }

  public static sortContentsColumn(etc: EditableTableComponent, columnIndex: number, isAsc: boolean) {
    const dataContents = etc.contents.slice(1);
    const {activeType} = etc.columnsDetails[columnIndex];
    if (activeType.calendar) {
      Sort.sortDates(activeType, dataContents, columnIndex, isAsc);
    } else if (activeType.sorting) {
      Sort.sortViaSetSortFuncs(activeType, dataContents, columnIndex, isAsc);
    } else {
      Sort.sortStrings(dataContents, columnIndex, isAsc);
    }
    Sort.update(etc, dataContents);
  }
}
