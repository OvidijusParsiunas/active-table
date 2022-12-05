import {ACTIVE_COLUMN_TYPE, DATE_COLUMN_TYPE, TEXT_DIV_COLUMN_TYPE} from '../../../../enums/columnType';
import {CalendarProperties, DateTypeToProperties} from '../../../../types/calendarProperties';
import {CellStructureUtils} from '../../../../utils/cellType/cellStructureUtils';
import {EditableTableComponent} from '../../../../editable-table-component';
import {DateCellInputElement} from './dateCellInputElement';
import {DateCellTextElement} from './dateCellTextElement';
import {Browser} from '../../../../utils/browser/browser';
import {DateCellEvents} from './dateCellEvents';

export class DateCellElement {
  public static readonly DATE_TYPE_TO_PROPERTIES: DateTypeToProperties = {};

  private static addNewDateType(dateTypeName: string, dateProperties: CalendarProperties) {
    DateCellElement.DATE_TYPE_TO_PROPERTIES[dateTypeName] = dateProperties;
    DATE_COLUMN_TYPE[dateTypeName] = dateTypeName;
    TEXT_DIV_COLUMN_TYPE[dateTypeName] = dateTypeName;
  }

  // added through addNewDateType method instead of direct in order to populate other objects with same name from one place
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
  public static setCellDateStructure(dateType: string, etc: EditableTableComponent,
      rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const textElement = DateCellTextElement.setCellTextAsAnElement(cellElement);
    if (Browser.IS_INPUT_DATE_SUPPORTED) DateCellInputElement.addDateInputElement(
      cellElement, textElement, dateType, etc.columnsDetails[columnIndex].activeType);
    setTimeout(() => DateCellEvents.setEvents(etc, cellElement, rowIndex, columnIndex, dateType));
  }

  public static setColumnDateStructure(etc: EditableTableComponent, columnIndex: number, dateType: string) {
    CellStructureUtils.set(etc, columnIndex, DateCellElement.setCellDateStructure.bind(etc, dateType));
  }
}
