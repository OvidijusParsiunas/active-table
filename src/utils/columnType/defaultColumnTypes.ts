import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {INSERT_RIGHT_ICON_SVG_STRING} from '../../consts/icons/insertIconSVGStrings';
import {CATEGORY_ICON_SVG_STRING} from '../../consts/icons/categoryIconSVGString';
import {ColumnTypeDropdownItem} from '../../types/columnTypeDropdownItem';
import {CalendarFunctionalityUtils} from './calendarFunctionalityUtils';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ColumnType, ColumnTypes} from '../../types/columnType';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {Validation} from './validation';
import {Sort} from './sort';

export class DefaultColumnTypes {
  public static readonly DEFAULT_TYPE: ColumnType = {
    name: DEFAULT_COLUMN_TYPES.TEXT,
  };

  public static readonly DEFAULT_STATIC_TYPES: ColumnTypes = [
    DefaultColumnTypes.DEFAULT_TYPE,
    {
      name: DEFAULT_COLUMN_TYPES.NUMBER,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.NUMBER]},
      sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.NUMBER],
      dropdownIconSettings: {
        svgString: INSERT_RIGHT_ICON_SVG_STRING,
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.CURRENCY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.CURRENCY]},
      sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.CURRENCY],
      dropdownIconSettings: {
        svgString: INSERT_RIGHT_ICON_SVG_STRING,
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_DMY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_MDY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
    },
  ];

  public static CATEGORY_TYPE_DROPDOWN_ITEM: ColumnTypeDropdownItem | null = null;

  private static createDropdownItemForCategoryType() {
    const settings = {
      text: DEFAULT_COLUMN_TYPES.CATEGORY,
      iconSettings: {
        svgString: CATEGORY_ICON_SVG_STRING,
        containerStyle: {marginTop: '2px', marginRight: '6px', marginLeft: '-1px'},
      },
    };
    DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM = {
      element: DropdownItem.createButtonWithoutEvents(undefined, settings),
      settings,
    };
  }

  private static createDropdownItemsForDefaultStaticTypes() {
    DefaultColumnTypes.DEFAULT_STATIC_TYPES.forEach((type) => {
      const settings = {
        text: type.name,
        iconSettings: type.dropdownIconSettings || DropdownButtonItemConf.DEFAULT_ITEM.iconSettings,
      };
      (type as ColumnTypeInternal).dropdownItem = {
        element: DropdownItem.createButtonWithoutEvents(undefined, settings),
        settings,
      };
    });
  }

  // REF-28
  public static createDropdownItemsForDefaultTypes() {
    DefaultColumnTypes.createDropdownItemsForDefaultStaticTypes();
    DefaultColumnTypes.createDropdownItemForCategoryType();
  }
}
