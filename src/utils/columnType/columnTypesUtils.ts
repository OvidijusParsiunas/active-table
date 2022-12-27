import {ColumnTypeInternal, ColumnTypesInternal} from '../../types/columnTypeInternal';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {ColumnType, ColumnTypes, DropdownIconSettings} from '../../types/columnType';
import {ColumnSettingsInternal} from '../../types/columnsSettings';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {DEFAULT_COLUMN_TYPES} from '../../enums/columnType';
import {ColumnDetailsT} from '../../types/columnDetails';
import {DefaultColumnTypes} from './defaultColumnTypes';
import {CellText} from '../../types/tableContents';
import {ObjectUtils} from '../object/objectUtils';
import {Validation} from './validation';

export class ColumnTypesUtils {
  public static get(settings: ColumnSettingsInternal): ColumnTypes {
    let columnTypes = [
      ...DefaultColumnTypes.DEFAULT_STATIC_TYPES,
      // the reason why category is not with the default static types is because its validation gets set depending
      // on column default settings
      {
        name: DEFAULT_COLUMN_TYPES.CATEGORY,
        categories: {},
        dropdownItem: DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM,
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

  private static getReusableDefaultIcon(iconSettings: DropdownIconSettings) {
    const targetIconName = iconSettings.defaultIconName?.toLocaleLowerCase();
    if (targetIconName === DEFAULT_COLUMN_TYPES.CATEGORY.toLocaleLowerCase()) {
      return DefaultColumnTypes.CATEGORY_TYPE_DROPDOWN_ITEM?.settings.iconSettings as DropdownIconSettings;
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
      if (dropdownIconSettings.defaultIconName) {
        iconSettings = ColumnTypesUtils.getReusableDefaultIcon(dropdownIconSettings);
      } else {
        iconSettings = dropdownIconSettings;
        if (Object.keys(dropdownIconSettings).length === 0) {
          iconSettings = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
        } else {
          iconSettings.svgString ??= DropdownButtonItemConf.DEFAULT_ITEM.iconSettings.svgString;
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
    if (type.textValidation) ObjectUtils.convertStringToFunction(type.textValidation, 'func');
    if (type.customTextProcessing) {
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeText');
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeStyle');
    }
    if (type.sorting) {
      ObjectUtils.convertStringToFunction(type.sorting, 'ascending');
      ObjectUtils.convertStringToFunction(type.sorting, 'descending');
    }
  }

  private static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    types.forEach((type) => {
      ColumnTypesUtils.convertStringFunctionsToRealFunctions(type);
      ColumnTypesUtils.processCategories(type, isDefaultTextRemovable, defaultText);
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
