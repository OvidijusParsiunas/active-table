import {CalendarFunctionalityUtils} from './calendarFunctionalityUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {ColumnTypes} from '../../types/columnType';
import {CellText} from '../../types/tableContents';
import {Validation} from './validation';
import {Sort} from './sort';

export class ColumnTypesUtils {
  public static getDefault(): ColumnTypes {
    return [
      {
        name: DEFAULT_COLUMN_TYPES.TEXT,
      },
      {
        name: DEFAULT_COLUMN_TYPES.NUMBER,
        validation: (cellText: CellText) => !isNaN(cellText as unknown as number),
        sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.NUMBER],
      },
      {
        name: DEFAULT_COLUMN_TYPES.CURRENCY,
        validation: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.CURRENCY],
        sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.CURRENCY],
      },
      {
        name: DEFAULT_COLUMN_TYPES.DATE_DMY,
        validation: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
        calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
      },
      {
        name: DEFAULT_COLUMN_TYPES.DATE_MDY,
        validation: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
        calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
      },
      {
        name: DEFAULT_COLUMN_TYPES.CATEGORY,
        categories: {},
      },
    ];
  }

  // if activeTypeName is not provided the following property will default to first of the following:
  // 'Text'/First type to not have validation/First available type/Nothing
  public static getActiveType(settings: ColumnSettingsInternal, availableTypes: ColumnTypes) {
    if (settings.activeTypeName) {
      const activeType = availableTypes.find((type) => type.name === settings.activeTypeName);
      if (activeType) return activeType;
    }
    const textType = availableTypes.find((type) => type.name === DEFAULT_COLUMN_TYPES.TEXT);
    if (textType) return textType;
    const noValidationType = availableTypes.find((type) => !type.validation);
    if (noValidationType) return noValidationType;
    const firstType = availableTypes[0];
    if (firstType) return firstType;
    return null;
  }

  // REF-3
  public static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      if (type.categories?.options) Validation.setCategoriesValidation(type, isDefaultTextRemovable, defaultText);
    });
  }
}
