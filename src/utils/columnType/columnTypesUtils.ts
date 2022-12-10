import {ColumnTypeInternal, ColumnTypesInternal} from '../../types/columnTypeInternal';
import {CalendarFunctionalityUtils} from './calendarFunctionalityUtils';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {ColumnType, ColumnTypes} from '../../types/columnType';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {CellText} from '../../types/tableContents';
import {ObjectUtils} from '../object/objectUtils';
import {Validation} from './validation';
import {Sort} from './sort';

export class ColumnTypesUtils {
  private static readonly DEFAULT_TYPE: ColumnType = {
    name: DEFAULT_COLUMN_TYPES.TEXT,
  };

  private static readonly DEFAULT_STATIC_TYPES: ColumnTypes = [
    ColumnTypesUtils.DEFAULT_TYPE,
    {
      name: DEFAULT_COLUMN_TYPES.NUMBER,
      validation: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.NUMBER],
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
  ];

  public static get(settings: ColumnSettingsInternal): ColumnTypes {
    let columnTypes = [
      ...ColumnTypesUtils.DEFAULT_STATIC_TYPES,
      // the reason why category is not with the default static types is because its validation gets set depending
      // on column default settings
      {
        name: DEFAULT_COLUMN_TYPES.CATEGORY,
        categories: {},
      },
    ];
    const {defaultColumnTypes, customColumnTypes} = settings;
    if (defaultColumnTypes) {
      const lowerCaseDefaultNames = defaultColumnTypes.map((typeName) => typeName.toLocaleLowerCase());
      columnTypes = columnTypes.filter((type) => {
        return lowerCaseDefaultNames.indexOf(type.name.toLocaleLowerCase() as DEFAULT_COLUMN_TYPES) > -1;
      });
    }
    if (customColumnTypes) columnTypes.push(...customColumnTypes);
    if (columnTypes.length === 0) columnTypes.push(ColumnTypesUtils.DEFAULT_TYPE);
    return columnTypes;
  }

  // prettier-ignore
  private static getActiveType(settings: ColumnSettingsInternal, availableTypes: ColumnTypes) {
    if (settings.activeTypeName) {
      const activeType = availableTypes.find(
        (type) => type.name.toLocaleLowerCase() === settings.activeTypeName?.toLocaleLowerCase());
      if (activeType) return activeType;
    }
    // if activeTypeName is not provided, default to first of the following:
    // First type to not have validation/First available type/'Text'
    const noValidationType = availableTypes.find((type) => !type.validation);
    if (noValidationType) return noValidationType;
    const firstType = availableTypes[0];
    if (firstType) return firstType;
    return ColumnTypesUtils.DEFAULT_TYPE;
  }

  private static processValidationProps(type: ColumnType) {
    type.validationProps ??= {};
    type.validationProps.setToDefaultTextOnFailed ??= true;
  }

  private static processCategories(type: ColumnType, isDefaultTextRemovable: boolean, defaultText: CellText) {
    if (typeof type.categories === 'boolean') {
      type.categories = {};
    } else if (typeof type.categories === 'object') {
      Validation.setCategoriesValidation(type as ColumnTypeInternal, isDefaultTextRemovable, defaultText);
    }
  }

  // the reason why this is needed is when the argument is JSON stringified, properties that hold functions are removed,
  // hence they can only be applied to the component as strings
  private static convertStringFunctionsToRealFunctions(type: ColumnType) {
    ObjectUtils.convertStringToFunction(type, 'validation');
    if (type.sorting) {
      ObjectUtils.convertStringToFunction(type.sorting, 'ascending');
      ObjectUtils.convertStringToFunction(type.sorting, 'descending');
    }
  }

  private static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      ColumnTypesUtils.convertStringFunctionsToRealFunctions(type);
      ColumnTypesUtils.processCategories(type, isDefaultTextRemovable, defaultText);
      ColumnTypesUtils.processValidationProps(type);
    });
    return types as ColumnTypesInternal;
  }

  public static getProcessedTypes(settings: ColumnSettingsInternal): Pick<ColumnDetailsT, 'types' | 'activeType'> {
    const {isDefaultTextRemovable, defaultText} = settings;
    const types = ColumnTypesUtils.get(settings);
    const processedInternalTypes = ColumnTypesUtils.process(types, isDefaultTextRemovable, defaultText);
    return {
      types: processedInternalTypes,
      activeType: ColumnTypesUtils.getActiveType(settings, types) as ColumnTypeInternal,
    };
  }
}
