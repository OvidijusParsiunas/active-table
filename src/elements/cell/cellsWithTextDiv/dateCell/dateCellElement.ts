import {ACTIVE_COLUMN_TYPE, DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE} from '../../../../enums/columnType';
import {DateProperties, DateTypeToProperties} from '../../../../types/dateTypeToProperties';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {CellWithTextElement} from '../cellWithTextElement';
import {DateCellTextElement} from './dateCellTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellEvents} from './dateCellEvents';

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

  // prettier-ignore
  public static convertCellFromDataToDate(dateType: string, etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
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
    CellWithTextElement.convertColumnToTextType(etc, columnIndex, previousType,
      DateCellElement.convertCellFromDataToDate.bind(etc, dateType))
  }
}
