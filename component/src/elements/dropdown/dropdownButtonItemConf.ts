import {DropdownButtonItemSettings, IconSettings} from '../../types/dropdownButtonItem';
import {DefaultColumnTypes} from '../../utils/columnType/defaultColumnTypes';

export class DropdownButtonItemConf {
  public static readonly DEFAULT_ITEM: DropdownButtonItemSettings = {
    text: DefaultColumnTypes.DEFAULT_TYPE.name,
    iconSettings: DefaultColumnTypes.DEFAULT_TYPE.iconSettings as IconSettings,
  };
}
