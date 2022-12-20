import {TEXT_ICON_SVG_STRING} from '../../consts/icons/textIconSVGString';
import {DropdownButtonItemSettings} from '../../types/dropdownButtonItem';

export class DropdownButtonItemConf {
  public static readonly DEFAULT_ITEM: DropdownButtonItemSettings = {
    text: '',
    iconSettings: {svgString: TEXT_ICON_SVG_STRING, containerStyle: {marginLeft: '1px', marginRight: '7px'}},
  };
}
