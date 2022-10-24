import {ACTIVE_COLUMN_TYPE, DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE} from '../../../../enums/columnType';
import {DateProperties, DateTypeToProperties} from '../../../../types/dateTypeToProperties';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {DateCellTextElement} from './dateCellTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellEvents} from './dateCellEvents';
import {CellElement} from '../../cellElement';

// WORK - refactor functions
export class DateCellElement {
  public static readonly DATE_TYPE_TO_PROPERTIES: DateTypeToProperties = {};

  // TO-DO - the column type will also need to be added to column types
  public static addNewDateType(dateTypeName: string, dateProperties: DateProperties) {
    DateCellElement.DATE_TYPE_TO_PROPERTIES[dateTypeName] = dateProperties;
    DATE_COLUMN_TYPE[dateTypeName] = dateTypeName;
    TEXT_DIV_COLUMN_TYPE[dateTypeName] = dateTypeName;
  }

  // added through addNewDateType method instead of direct in order perform other important operations
  public static populateDefaultDateTypes() {
    DateCellElement.addNewDateType(ACTIVE_COLUMN_TYPE.Date_D_M_Y, {
      separator: '-',
      structureIndexes: {
        day: 0,
        month: 1,
        year: 2,
      },
    });
    DateCellElement.addNewDateType(ACTIVE_COLUMN_TYPE.Date_M_D_Y, {
      separator: '-',
      structureIndexes: {
        day: 1,
        month: 0,
        year: 2,
      },
    });
  }

  public static isDateInputElement(element?: Element): element is HTMLInputElement {
    return (element as HTMLInputElement)?.type === 'date';
  }

  public static getCellElement(element: HTMLElement) {
    if (
      element.classList.contains(CellElement.CELL_TEXT_DIV_CLASS) ||
      element.classList.contains(DateCellInputElement.DATE_INPUT_CONTAINER_CLASS)
    ) {
      return element.parentElement as HTMLElement;
    } else if (element.classList.contains(DateCellInputElement.DATE_INPUT_CLASS)) {
      return (element.parentElement as HTMLElement).parentElement as HTMLElement;
    }
    return element;
  }

  public static hideDatePicker(datePickerInput: HTMLElement) {
    (datePickerInput.parentElement as HTMLElement).style.display = 'none';
  }

  // prettier-ignore
  public static convertCellFromDataToDate(etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement, dateType: string) {
    const textElement = DateCellTextElement.createTextElement(cellElement.textContent as string);
    DateCellTextElement.setTextAsAnElement(cellElement, textElement);
    if (Browser.IS_INPUT_DATE_SUPPORTED) {
      DateCellInputElement.addDateInputElement(cellElement, textElement, etc.defaultCellValue, dateType);
    }
    DateCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex, dateType);
  }

  // prettier-ignore
  public static convertColumnTypeToDate(
      etc: EditableTableComponent, columnIndex: number, previousType: string, dateType: string) {
    const {elements} = etc.columnsDetails[columnIndex];
    const shouldResetContents = Boolean(TEXT_DIV_COLUMN_TYPE[previousType]);
      elements.slice(1).forEach((cellElement: HTMLElement, dataIndex: number) => {
      // this is a very simple way to clear the previous content inside the cell and replace it with cell text
      // additionallity it may not be as efficient because this if statement will be called every time,
      // however no efficiency issues have been seen on the browser so far
      if (shouldResetContents) {
        const text = (cellElement.children[0] as HTMLElement).textContent as string;
        cellElement.textContent = text;
      }
      const relativeIndex = dataIndex + 1;
      DateCellElement.convertCellFromDataToDate(etc, relativeIndex, columnIndex, cellElement, dateType);
    });
  }
}
