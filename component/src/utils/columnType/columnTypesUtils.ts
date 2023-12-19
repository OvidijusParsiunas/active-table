import {ColumnTypeInternal, ColumnTypesInternal, CellDropdownPropertiesI} from '../../types/columnTypeInternal';
import {DateCellInputElement} from '../../elements/cell/cellsWithTextDiv/dateCell/dateCellInputElement';
import {CheckboxValidationFunc} from '../../elements/cell/checkboxCell/checkboxValidationFunc';
import {DropdownButtonItemConf} from '../../elements/dropdown/dropdownButtonItemConf';
import {SelectCell} from '../../elements/cell/cellsWithTextDiv/selectCell/selectCell';
import {ColumnType, ColumnTypes, ColumnIconSettings} from '../../types/columnType';
import {CellDropdown} from '../../elements/dropdown/cellDropdown/cellDropdown';
import {ColumnSettingsInternal} from '../../types/columnsSettingsInternal';
import {DEFAULT_COLUMN_TYPES} from '../../enums/defaultColumnTypes';
import {DropdownItem} from '../../elements/dropdown/dropdownItem';
import {IconSettings} from '../../types/dropdownButtonItem';
import {DefaultColumnTypes} from './defaultColumnTypes';
import {ObjectUtils} from '../object/objectUtils';
import {CellText} from '../../types/tableData';
import {ActiveTable} from '../../activeTable';
import {Browser} from '../browser/browser';
import {Validation} from './validation';

export class ColumnTypesUtils {
  private static getTypeByName(availableTypes: ColumnTypesInternal, targetName: string) {
    return availableTypes.find((type) => type.name.toLocaleLowerCase() === targetName?.toLocaleLowerCase());
  }

  private static getTypeBasedOnProperties(settings: ColumnSettingsInternal, previousTypeName?: string) {
    // if changing type due to settings change - the activeType would already be set - then try to see if the previous
    // type is present in the new settings and if it is use it
    if (previousTypeName) {
      const type = ColumnTypesUtils.getTypeByName(settings.types, previousTypeName);
      if (type) return type;
    }
    // if there is no previous type or it is not found in new settings - use the one the user has set
    if (settings.defaultColumnTypeName) {
      const type = ColumnTypesUtils.getTypeByName(settings.types, settings.defaultColumnTypeName);
      if (type) return type;
    }
    return undefined;
  }

  public static getActiveType(settings: ColumnSettingsInternal, previousTypeName?: string): ColumnTypeInternal {
    const activeType = ColumnTypesUtils.getTypeBasedOnProperties(settings, previousTypeName);
    if (activeType) return activeType;
    // if defaultColumnTypeName is not provided, default to first of the following:
    // First type to not have validation/First available type/'Text'
    const noValidationType = settings.types.find((type) => !type.textValidation.func);
    if (noValidationType) return noValidationType;
    const firstType = settings.types[0];
    if (firstType) return firstType;
    return DefaultColumnTypes.FALLBACK_TYPE as ColumnTypeInternal;
  }

  // prettier-ignore
  private static getReusableDefaultIcon(iconSettings: ColumnIconSettings) {
    const targetIconName = iconSettings.reusableIconName?.toLocaleLowerCase();
    const defaultSettings = DefaultColumnTypes.DEFAULT_TYPES.find((type) => {
      return type.name.toLocaleLowerCase() === targetIconName;
    });
    if (defaultSettings?.iconSettings) return defaultSettings.iconSettings;
    return DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
  }

  private static processDropdownItemSettings(type: ColumnType) {
    const {name, iconSettings} = type;
    let dropdownIconSettings: IconSettings;
    if (iconSettings) {
      if (iconSettings.reusableIconName) {
        dropdownIconSettings = ColumnTypesUtils.getReusableDefaultIcon(iconSettings) as IconSettings;
      } else {
        dropdownIconSettings = iconSettings;
        if (Object.keys(iconSettings).length === 0) {
          dropdownIconSettings = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
        } else if (!iconSettings.svgString) {
          dropdownIconSettings.svgString ??= DropdownButtonItemConf.DEFAULT_ITEM.iconSettings.svgString;
          dropdownIconSettings.containerStyles ??= DropdownButtonItemConf.DEFAULT_ITEM.iconSettings.containerStyles;
        }
      }
    } else {
      dropdownIconSettings = DropdownButtonItemConf.DEFAULT_ITEM.iconSettings;
    }
    const settings = {text: name, iconSettings: dropdownIconSettings};
    const internalType = type as ColumnTypeInternal;
    internalType.dropdownItem ??= {element: null, settings};
    // reason for using timeout - creating icons is expensive and they are not needed on initial render
    setTimeout(() => {
      internalType.dropdownItem.element ??= DropdownItem.createButtonItemNoEvents(undefined, settings);
    });
  }

  private static processTextValidationProps(type: ColumnType) {
    type.textValidation ??= {};
    type.textValidation.setTextToDefaultOnFail ??= true;
  }

  private static processCheckbox(type: ColumnType) {
    if (type.checkbox && !type.customTextProcessing?.changeTextFunc) {
      type.customTextProcessing ??= {};
      type.customTextProcessing.changeTextFunc = CheckboxValidationFunc.getDefault();
    }
  }

  private static processSelectOptions(type: ColumnType) {
    if (typeof type.select === 'object' && type.select.options) {
      const internalSelectProps = type.select as CellDropdownPropertiesI;
      internalSelectProps.options = type.select.options.map((option) => {
        return {text: option};
      });
    } else if (typeof type.label === 'object' && type.label.options) {
      const internalSelectProps = type.label as CellDropdownPropertiesI;
      // the reason for deep copy is because if canAddMoreOptions is set - colors can be changed and if the user
      // is reusing the same object for multiple columns a change in one can affect all others
      internalSelectProps.options = JSON.parse(JSON.stringify(type.label.options));
    }
  }

  private static processSelect(type: ColumnType, isDefaultTextRemovable: boolean, defaultText: CellText) {
    const internalType = type as ColumnTypeInternal;
    if (type.select === true || type.label === true) {
      internalType.cellDropdownProps = {isBasicSelect: !type.label};
    } else if (typeof type.select === 'object' || typeof type.label === 'object') {
      internalType.cellDropdownProps = (type.select || type.label) as CellDropdownPropertiesI;
      internalType.cellDropdownProps.isBasicSelect = !type.label;
      ColumnTypesUtils.processSelectOptions(type);
      Validation.setSelectValidation(internalType, isDefaultTextRemovable, defaultText);
    }
    if (internalType.cellDropdownProps && internalType.cellDropdownProps.canAddMoreOptions === undefined) {
      internalType.cellDropdownProps.canAddMoreOptions = !internalType.cellDropdownProps?.options;
    }
  }

  // the reason why this is needed is when the argument is JSON stringified, properties that hold functions are removed,
  // hence they can only be applied to the component as strings
  private static convertStringFunctionsToRealFunctions(type: ColumnType) {
    if (type.textValidation) {
      ObjectUtils.convertStringToFunction(type.textValidation, 'func');
    }
    if (type.customTextProcessing) {
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeTextFunc');
      ObjectUtils.convertStringToFunction(type.customTextProcessing, 'changeStyleFunc');
    }
    if (type.sorting) {
      ObjectUtils.convertStringToFunction(type.sorting, 'ascendingFunc');
      ObjectUtils.convertStringToFunction(type.sorting, 'descendingFunc');
    }
    if (type.calendar) {
      ObjectUtils.convertStringToFunction(type.calendar, 'toYMDFunc');
      ObjectUtils.convertStringToFunction(type.calendar, 'fromYMDFunc');
    }
  }

  // this is important because when types get processed - their resultant structure is not be the same, hence if
  // the same one is used in different settings (e.g. defaultColumnTypes set in default and custom settings),
  // the processing of the same type again would not work
  // JSON.stringify loses element and function references, hence they need to be manually reassigned
  private static createTypeDeepCopy(type: ColumnTypeInternal) {
    const newType = JSON.parse(JSON.stringify(type)) as ColumnTypeInternal;
    if (type.dropdownItem) newType.dropdownItem = type.dropdownItem;
    if (type.textValidation) newType.textValidation = type.textValidation;
    if (type.customTextProcessing) newType.customTextProcessing = type.customTextProcessing;
    if (type.sorting) newType.sorting = type.sorting;
    if (type.calendar) newType.calendar = type.calendar;
    return newType;
  }

  private static process(types: ColumnTypes, isDefaultTextRemovable: boolean, defaultText: CellText) {
    return types.map((type) => {
      const newType = ColumnTypesUtils.createTypeDeepCopy(type as ColumnTypeInternal);
      ColumnTypesUtils.convertStringFunctionsToRealFunctions(newType);
      ColumnTypesUtils.processSelect(newType, isDefaultTextRemovable, defaultText);
      ColumnTypesUtils.processCheckbox(newType);
      ColumnTypesUtils.processTextValidationProps(newType);
      ColumnTypesUtils.processDropdownItemSettings(newType);
      return newType as ColumnTypeInternal;
    });
  }

  private static getAvailableTypes(settings: ColumnSettingsInternal): ColumnTypes {
    let columnTypes = [...DefaultColumnTypes.DEFAULT_TYPES];
    const {availableDefaultColumnTypes, customColumnTypes} = settings;
    if (availableDefaultColumnTypes) {
      const lowerCaseDefaultNames = availableDefaultColumnTypes.map((typeName) => typeName.toLocaleLowerCase());
      columnTypes = columnTypes.filter((type) => {
        return lowerCaseDefaultNames.indexOf(type.name.toLocaleLowerCase() as DEFAULT_COLUMN_TYPES) > -1;
      });
    }
    if (customColumnTypes) columnTypes.push(...customColumnTypes);
    if (columnTypes.length === 0) columnTypes.push(DefaultColumnTypes.FALLBACK_TYPE);
    return columnTypes;
  }

  public static getProcessedTypes(settings: ColumnSettingsInternal) {
    const {isDefaultTextRemovable, defaultText} = settings;
    const types = ColumnTypesUtils.getAvailableTypes(settings);
    return ColumnTypesUtils.process(types, isDefaultTextRemovable, defaultText);
  }

  // updates label color, date input etc.
  // prettier-ignore
  public static updateDataElements(at: ActiveTable, rowIndex: number, columnIndex: number, cellElement: HTMLElement) {
    const {_columnsDetails, _tableDimensions} = at;
    const columnDetails = _columnsDetails[columnIndex];
    if (rowIndex === 0) return;
    if (columnDetails.activeType.cellDropdownProps) {
      CellDropdown.updateCellDropdown(cellElement,
        columnDetails.cellDropdown, _tableDimensions.border, columnDetails.settings.defaultText, true);
      SelectCell.finaliseEditedText(at, cellElement.children[0] as HTMLElement, columnIndex, true);
    } else if (Browser.IS_INPUT_DATE_SUPPORTED && columnDetails.activeType.calendar) {
      DateCellInputElement.updateInputBasedOnTextDiv(cellElement, columnDetails.activeType);
    }
  }
}
