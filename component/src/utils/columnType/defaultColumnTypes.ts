import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {CURRENCY_ICON_SVG_STRING} from '../../consts/icons/currencyIconSVGString';
import {CALENDAR_ICON_SVG_STRING} from '../../consts/icons/calendarIconSVGString';
import {CHECKBOX_ICON_SVG_STRING} from '../../consts/icons/checkboxIconSVGString';
import {SELECT_ICON_SVG_STRING} from '../../consts/icons/selectIconSVGString';
import {NUMBER_ICON_SVG_STRING} from '../../consts/icons/numberIconSVGString';
import {LABEL_ICON_SVG_STRING} from '../../consts/icons/labelIconSVGString';
import {ColumnTypeDropdownItem} from '../../types/columnTypeDropdownItem';
import {TEXT_ICON_SVG_STRING} from '../../consts/icons/textIconSVGString';
import {DropdownButtonItemSettings} from '../../types/dropdownButtonItem';
import {CalendarFunctionalityUtils} from './calendarFunctionalityUtils';
import {DEFAULT_COLUMN_TYPES} from '../../enums/defaultColumnTypes';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {ColumnTypeInternal} from '../../types/columnTypeInternal';
import {ColumnType, ColumnTypes} from '../../types/columnType';
import {CellText} from '../../types/tableContent';
import {Validation} from './validation';
import {Sort} from './sort';

export class DefaultColumnTypes {
  public static readonly DEFAULT_TYPE: ColumnType = {
    name: DEFAULT_COLUMN_TYPES.TEXT,
    dropdownIconSettings: {
      svgString: TEXT_ICON_SVG_STRING,
      containerStyles: {
        dropdown: {marginLeft: '-0.25px', marginRight: '6px', marginTop: '2.5px'},
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
          dropdown: {marginLeft: '-2px', marginRight: '4px', marginTop: '1px'},
          headerCorrections: {marginRight: '3px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.CHECKBOX,
      dropdownIconSettings: {
        svgString: CHECKBOX_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginRight: '6px', marginTop: '2.5px'},
          headerCorrections: {marginRight: '5px', marginLeft: '1px', marginTop: '3px'},
        },
      },
      checkbox: true,
      customTextProcessing: {
        // cannot place this inside the CheckboxCellElement class as certain dependencies are not imported in time
        changeText: (text: CellText) => {
          const processedString = String(text).trim().toLocaleLowerCase();
          // prettier-ignore
          if (processedString === '' || processedString === '0'
              || processedString === '00' || processedString === 'false') {
            return 'false';
          }
          return 'true';
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_DMY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_DMY],
      dropdownIconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '1.25px', marginRight: '8px', marginTop: '-2px'},
          headerCorrections: {marginTop: '0px'},
        },
      },
    },
    {
      name: DEFAULT_COLUMN_TYPES.DATE_MDY,
      textValidation: {func: Validation.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY]},
      calendar: CalendarFunctionalityUtils.DEFAULT_TYPES_FUNCTIONALITY[DEFAULT_COLUMN_TYPES.DATE_MDY],
      dropdownIconSettings: {
        svgString: CALENDAR_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginLeft: '1.25px', marginRight: '8px', marginTop: '-2px'},
          headerCorrections: {marginTop: '0px'},
        },
      },
    },
  ];

  public static SELECT_TYPE_DROPDOWN_ITEM: ColumnTypeDropdownItem | null = null;

  public static SELECT_LABEL_TYPE_DROPDOWN_ITEM: ColumnTypeDropdownItem | null = null;

  // the reason why select and label select are not with the default static types is because their validation
  // is not generic and get set by column settings - setSelectValidation
  private static createDropdownItemForSelectTypes() {
    const selectSettings: DropdownButtonItemSettings = {
      text: DEFAULT_COLUMN_TYPES.SELECT,
      iconSettings: {
        svgString: SELECT_ICON_SVG_STRING,
        containerStyles: {
          dropdown: {marginTop: '0.5px', marginRight: '3px', marginLeft: '-2.75px'},
          headerCorrections: {marginTop: '1.5px'},
        },
      },
    };
    DefaultColumnTypes.SELECT_TYPE_DROPDOWN_ITEM = {
      element: DropdownItem.createButtonItemNoEvents(undefined, selectSettings),
      settings: selectSettings,
    };
    const labelSettings: DropdownButtonItemSettings = {
      text: DEFAULT_COLUMN_TYPES.LABEL,
      iconSettings: {
        svgString: LABEL_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginTop: '2px', marginRight: '5.5px', marginLeft: '-1px'}},
      },
    };
    DefaultColumnTypes.SELECT_LABEL_TYPE_DROPDOWN_ITEM = {
      element: DropdownItem.createButtonItemNoEvents(undefined, labelSettings),
      settings: labelSettings,
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
    DefaultColumnTypes.createDropdownItemForSelectTypes();
  }
}
