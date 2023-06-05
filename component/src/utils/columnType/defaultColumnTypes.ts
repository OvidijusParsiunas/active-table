import {CheckboxValidationFunc} from '../../elements/cell/checkboxCell/checkboxValidationFunc';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {CURRENCY_ICON_SVG_STRING} from '../../consts/icons/currencyIconSVGString';
import {CALENDAR_ICON_SVG_STRING} from '../../consts/icons/calendarIconSVGString';
import {CHECKBOX_ICON_SVG_STRING} from '../../consts/icons/checkboxIconSVGString';
import {SELECT_ICON_SVG_STRING} from '../../consts/icons/selectIconSVGString';
import {NUMBER_ICON_SVG_STRING} from '../../consts/icons/numberIconSVGString';
import {LABEL_ICON_SVG_STRING} from '../../consts/icons/labelIconSVGString';
import {TEXT_ICON_SVG_STRING} from '../../consts/icons/textIconSVGString';
import {CalendarFunctionalityUtils} from './calendarFunctionalityUtils';
import {DEFAULT_COLUMN_TYPES} from '../../enums/defaultColumnTypes';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ColumnType, ColumnTypes} from '../../types/columnType';
import {IconSettings} from '../../types/dropdownButtonItem';
import {Validation} from './validation';
import {Sort} from './sort';

export class DefaultColumnTypes {
  public static readonly FALLBACK_TYPE: ColumnType = {
    name: DEFAULT_COLUMN_TYPES.TEXT,
    iconSettings: {
      svgString: TEXT_ICON_SVG_STRING,
      containerStyles: {
        dropdown: {marginLeft: '-0.25px', marginRight: '6px', marginTop: '2.5px'},
        headerCorrections: {marginTop: '2.5px'},
      },
    },
  };

  public static readonly DEFAULT_TYPES: ColumnTypes = [
    DefaultColumnTypes.FALLBACK_TYPE,
    {
      name: DEFAULT_COLUMN_TYPES.NUMBER,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.NUMBER]},
      sorting: Sort.DEFAULT_TYPES_SORT_FUNCS[DEFAULT_COLUMN_TYPES.NUMBER],
      iconSettings: {
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
      iconSettings: {
        svgString: CURRENCY_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '-2px', marginRight: '4px', marginTop: '1px'},
          headerCorrections: {marginRight: '3px', marginTop: '2px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.SELECT,
      select: {},
      iconSettings: {
        svgString: SELECT_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginTop: '0.5px', marginRight: '3px', marginLeft: '-2.75px'},
          headerCorrections: {marginTop: '1px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.LABEL,
      label: {},
      iconSettings: {
        svgString: LABEL_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginTop: '1.5px', marginRight: '5.5px', marginLeft: '-1px'},
          headerCorrections: {marginTop: '2.5px', marginRight: '5.5px', marginLeft: '0px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.CHECKBOX,
      iconSettings: {
        svgString: CHECKBOX_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginRight: '6px', marginTop: '2.5px'},
          headerCorrections: {marginRight: '5px', marginLeft: '1px', marginTop: '3px'},
        },
      },
      checkbox: true,
      customTextProcessing: {
        changeTextFunc: CheckboxValidationFunc.getDefault(),
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_DMY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
      iconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '1.25px', marginRight: '8px', marginTop: '-1.5px'},
          headerCorrections: {marginTop: '0px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_MDY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
      iconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '1.25px', marginRight: '8px', marginTop: '-1.5px'},
          headerCorrections: {marginTop: '0px'},
        },
      },
    },
  ];

  // REF-28
  public static createDropdownItemsForDefaultTypes() {
    DefaultColumnTypes.DEFAULT_TYPES.forEach((type) => {
      const settings = {
        text: type.name,
        iconSettings: (type.iconSettings as IconSettings) || DropdownButtonItemConf.DEFAULT_ITEM.iconSettings,
      };
      (type as ColumnTypeInternal).dropdownItem = {
        element: DropdownItem.createButtonItemNoEvents(undefined, settings),
        settings,
      };
    });
  }
}
