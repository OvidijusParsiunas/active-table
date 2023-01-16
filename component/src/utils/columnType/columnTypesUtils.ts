import {ColumnTypeInternal, ColumnTypesInternal, SelectPropertiesInternal} from '../../types/columnTypeInternal';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {ColumnType, ColumnTypes, DropdownIconSettings} from '../../types/columnType';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {DefaultColumnTypes} from './defaultColumnTypes';
import {CellText} from '../../types/tableContent';
import {ObjectUtils} from '../object/objectUtils';
import {Validation} from './validation';

export class ColumnTypesUtils {
  public static get(settings: ColumnSettingsInternal): ColumnTypes {
    let columnTypes = [
      ...DefaultColumnTypes.DEFAULT_STATIC_TYPES.slice(0, 3),
      // the reason why select and label are not with the default static types is because their validation
      // is not generic and get set by on column settings - setSelectValidation
      {
        name: DEFAULT_COLUMN_TYPES.SELECT,
        select: {},
        dropdownItem: DefaultColumnTypes.SELECT_TYPE_DROPDOWN_ITEM,
      },
      {
        name: DEFAULT_COLUMN_TYPES.LABEL,
        label: {},
        dropdownItem: DefaultColumnTypes.SELECT_LABEL_TYPE_DROPDOWN_ITEM,
      },
      ...DefaultColumnTypes.DEFAULT_STATIC_TYPES.slice(3),
    ];
    const {defaultColumnTypes, customColumnTypes} = settings;
    if (defaultColumnTypes) {
      const lowerCaseDefaultNames = defaultColumnTypes.map((typeName) => typeName.toLocaleLowerCase());
      columnTypes = columnTypes.filter((type) => {
        return lowerCaseDefaultNames.indexOf(type.name.toLocaleLowerCase() as DEFAULT_COLUMN_TYPES) > -1;
      });
    }
    if (customColumnTypes) columnTypes.push(...customColumnTypes);
    if (columnTypes.length === 0) columnTypes.push(DefaultColumnTypes.DEFAULT_TYPE);
    return columnTypes;
  }

  private static getTypeByName(availableTypes: ColumnTypesInternal, targetName: string) {
    return availableTypes.find((type) => type.name.toLocaleLowerCase() === targetName?.toLocaleLowerCase());
  }

  // prettier-ignore
  private static getTypeBasedOnProperties(settings: ColumnSettingsInternal, availableTypes: ColumnTypesInternal,
      previousTypeName?: string) {
    // if changing type due to settings change - the activeType would already be set - then try to see if the previous
    // type is present in the new settings and if it is use it
    if (previousTypeName) {
      const type = ColumnTypesUtils.getTypeByName(availableTypes, previousTypeName);
      if (type) return type;
    }
    // if there is no previous type or it is not found in new settings - use the one the user has set
    if (settings.activeTypeName) {
      const type = ColumnTypesUtils.getTypeByName(availableTypes, settings.activeTypeName);
      if (type) return type;
    }
    return undefined;
  }

  // prettier-ignore
  private static getActiveType(settings: ColumnSettingsInternal, availableTypes: ColumnTypesInternal,
      previousTypeName?: string) {
    const activeType = ColumnTypesUtils.getTypeBasedOnProperties(settings, availableTypes, previousTypeName);
    if (activeType) return activeType;
    // if activeTypeName is not provided, default to first of the following:
    // First type to not have validation/First available type/'Text'
    const noValidationType = availableTypes.find((type) => !type.textValidation.func);
    if (noValidationType) return noValidationType;
    const firstType = availableTypes[0];
    if (firstType) return firstType;
    return DefaultColumnTypes.DEFAULT_TYPE;
  }

  // prettier-ignore
  private static getReusableDefaultIcon(iconSettings: DropdownIconSettings) {
    const targetIconName = iconSettings.reusableIconName?.toLocaleLowerCase();
    if (targetIconName === DEFAULT_COLUMN_TYPES.SELECT.toLocaleLowerCase()
      || targetIconName === DEFAULT_COLUMN_TYPES.LABEL.toLocaleLowerCase()) {
      return DefaultColumnTypes.SELECT_TYPE_DROPDOWN_ITEM?.settings.iconSettings as DropdownIconSettings;
    }
    const defaultSettings = DefaultColumnTypes.DEFAULT_STATIC_TYPES.find((type) => {
      return type.name.toLocaleLowerCase() === targetIconName;
    });
    if (defaultSettings?.dropdownIconSettings) return defaultSettings.dropdownIconSettings;
    return DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
  }

  private static processDropdownItemSettings(type: ColumnType) {
    const {name, dropdownIconSettings} = type;
    let iconSettings = null;
    if (dropdownIconSettings) {
      if (dropdownIconSettings.reusableIconName) {
        iconSettings = ColumnTypesUtils.getReusableDefaultIcon(dropdownIconSettings);
      } else {
        iconSettings = dropdownIconSettings;
        if (Object.keys(dropdownIconSettings).length === 0) {
          iconSettings = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
        } else if (!iconSettings.svgString) {
          iconSettings.svgString ??= DropdownButtonItemConf.DEFAULT_ITEM.iconSettings.svgString;
          iconSettings.containerStyles ??= DropdownButtonItemConf.DEFAULT_ITEM.iconSettings.containerStyles;
        }
      }
    } else {
      iconSettings = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
    }
    const settings = {text: name, iconSettings};
    const internalType = type as ColumnTypeInternal;
    internalType.dropdownItem ??= {element: null, settings: settings};
    // reason for using timeout - creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      internalType.dropdownItem.element ??= DropdownItem.createButtonItemNoEvents(undefined, settings);
    });
  }

  private static processTextValidationProps(type: ColumnType) {
    type.textValidation ??= {};
    type.textValidation.setTextToDefaultOnFail ??= true;
  }

  private static processSelectOptions(type: ColumnType) {
    if (typeof type.select === 'object' && type.select.options) {
      const internalSelectProps = type.select as SelectPropertiesInternal;
      internalSelectProps.options = type.select.options.map((option) => {
        return {name: option};
      });
    } else if (typeof type.label === 'object' && type.label.options) {
      const internalSelectProps = type.label as SelectPropertiesInternal;
      // the reason for deep copy is because if canAddMoreOptions is set - colors can be changed and if the user
      // is reusing the same object for multiple columns a change in one can affect all others
      internalSelectProps.options = JSON.parse(JSON.stringify(type.label.options));
    }
  }

  private static processSelect(type: ColumnType, isDefaultTextRemovable: boolean, defaultText: CellText) {
    const internalType = type as ColumnTypeInternal;
    if (type.select === true || type.label === true) {
      internalType.selectProps = {isBasicSelect: !type.label};
    } else if (typeof type.select === 'object' || typeof type.label === 'object') {
      internalType.selectProps = (type.select || type.label) as SelectPropertiesInternal;
      internalType.selectProps.isBasicSelect = !type.label;
      ColumnTypesUtils.processSelectOptions(type);
      Validation.setSelectValidation(internalType, isDefaultTextRemovable, defaultText);
    }
    if (internalType.selectProps && internalType.selectProps.canAddMoreOptions === undefined) {
      internalType.selectProps.canAddMoreOptions = !internalType.selectProps?.options;
    }
  }

  // the reason why this is needed is when the argument is JSON stringified, properties that hold functions are removed,
  // hence they can only be applied to the component as strings
  private static convertStringFunctionsToRealFunctions(type: ColumnType) {
    if (type.textValidation) ObjectUtils.convertStringToFunction(type.textValidation, 'func');
    if (type.customTextProcessing) {
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeText');
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeStyle');
    }
    if (type.sorting) {
      ObjectUtils.convertStringToFunction(type.sorting, 'ascending');
      ObjectUtils.convertStringToFunction(type.sorting, 'descending');
    }
    if (type.calendar) {
      ObjectUtils.convertStringToFunction(type.calendar, 'toYMD');
      ObjectUtils.convertStringToFunction(type.calendar, 'fromYMD');
    }
  }

  private static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      ColumnTypesUtils.convertStringFunctionsToRealFunctions(type);
      ColumnTypesUtils.processSelect(type, isDefaultTextRemovable, defaultText);
      ColumnTypesUtils.processTextValidationProps(type);
      ColumnTypesUtils.processDropdownItemSettings(type);
    });
    return types as ColumnTypesInternal;
  }

  // prettier-ignore
  public static getProcessedTypes(settings: ColumnSettingsInternal,
      previousTypeName?: string): Pick<ColumnDetailsT, 'types' | 'activeType'> {
    const {isDefaultTextRemovable, defaultText} = settings;
    const types = ColumnTypesUtils.get(settings);
    const processedInternalTypes = ColumnTypesUtils.process(types, isDefaultTextRemovable, defaultText);
    return {
      types: processedInternalTypes,
      activeType: ColumnTypesUtils.getActiveType(settings, processedInternalTypes, previousTypeName) as ColumnTypeInternal,
    };
  }
}
