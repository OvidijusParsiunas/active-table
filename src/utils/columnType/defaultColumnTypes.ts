import {CheckboxCellElement} from '../../elements/cell/checkboxCell/checkboxCellElement';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {CATEGORY_ICON_SVG_STRING} from '../../consts/icons/categoryIconSVGString';
import {CURRENCY_ICON_SVG_STRING} from '../../consts/icons/currencyIconSVGString';
import {CALENDAR_ICON_SVG_STRING} from '../../consts/icons/calendarIconSVGString';
import {NUMBER_ICON_SVG_STRING} from '../../consts/icons/numberIconSVGString';
import {ColumnTypeDropdownItem} from '../../types/columnTypeDropdownItem';
import {TEXT_ICON_SVG_STRING} from '../../consts/icons/textIconSVGString';
import {DropdownButtonItemSettings} from '../../types/dropdownButtonItem';
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
    dropdownIconSettings: {
      svgString: TEXT_ICON_SVG_STRING,
      containerStyles: {
        dropdown: {marginLeft: '-0.25px', marginRight: '6px', marginTop: '1.5px'},
        headerCorrections: {marginTop: '2.5px'},
      },
    },
  };

  public static readonly DEFAULT_STATIC_TYPES: ColumnTypes = [
    DefaultColumnTypes.DEFAULT_TYPE,
    {
      name: DEFAULT_COLUMN_TYPES.NUMBER,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.NUMBER]},
      sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.NUMBER],
      dropdownIconSettings: {
        svgString: NUMBER_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '-1px', marginRight: '4.5px', marginTop: '2px'},
          headerCorrections: {marginTop: '2.5px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.CURRENCY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.CURRENCY]},
      sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.CURRENCY],
      dropdownIconSettings: {
        svgString: CURRENCY_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '-2px', marginRight: '4px', marginTop: '2px'},
          headerCorrections: {marginRight: '3px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_DMY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
      dropdownIconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginLeft: '1px', marginRight: '8px'}},
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_MDY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
      dropdownIconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginLeft: '1px', marginRight: '8px'}},
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.CHECKBOX,
      // textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY]},
      dropdownIconSettings: {
        svgString: CATEGORY_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginTop: '2px', marginRight: '5.5px', marginLeft: '-1px'}},
      },
      checkbox: true,
      customTextProcessing: {
        changeText: CheckboxCellElement.defaultChangeTextFunc,
      },
    },
  ];

  public static CATEGORY_TYPE_DROPDOWN_ITEM: ColumnTypeDropdownItem | null = null;

  private static createDropdownItemForCategoryType() {
    const settings: DropdownButtonItemSettings = {
      text: DEFAULT_COLUMN_TYPES.CATEGORY,
      iconSettings: {
        svgString: CATEGORY_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginTop: '2px', marginRight: '5.5px', marginLeft: '-1px'}},
      },
    };
    DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM = {
      element: DropdownItem.createButtonItemNoEvents(undefined, settings),
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
        element: DropdownItem.createButtonItemNoEvents(undefined, settings),
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
