import {CALENDAR_ICON_SVG_STRING} from '../../consts/icons/calendarIconSVGString';
import {DropdownButtonItemSettings} from '../../types/dropdownButtonItem';

export class DropdownButtonItemConf {
  public static readonly DEFAULT_ITEM: DropdownButtonItemSettings = {
    text: '',
    iconSettings: {svgString: CALENDAR_ICON_SVG_STRING},
  };
}
