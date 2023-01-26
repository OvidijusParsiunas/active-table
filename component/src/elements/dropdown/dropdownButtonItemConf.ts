import {DropdownButtonItemSettings, IconSettings} from '../../types/dropdownButtonItem';
import {DefaultColumnTypes} from '../../utils/columnType/defaultColumnTypes';

export class DropdownButtonItemConf {
  public static readonly DEFAULT_ITEM: DropdownButtonItemSettings = {
    text: DefaultColumnTypes.FALLBACK_TYPE.name,
    iconSettings: DefaultColumnTypes.FALLBACK_TYPE.iconSettings as IconSettings,
  };
}
