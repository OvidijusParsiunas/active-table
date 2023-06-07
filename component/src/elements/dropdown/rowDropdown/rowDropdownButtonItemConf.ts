import {INSERT_DOWN_ICON_SVG_STRING, INSERT_UP_ICON_SVG_STRING} from '../../../consts/icons/insertIconSVGStrings';
import {MOVE_DOWN_ICON_SVG_STRING, MOVE_UP_ICON_SVG_STRING} from '../../../consts/icons/moveIconSVGStrings';
import {TRASH_ICON_SVG_STRING} from '../../../consts/icons/trashIconSVGString';
import {DropdownButtonItemSettings} from '../../../types/dropdownButtonItem';

// TO-DO - potential opportunity to use code sharding and download strings later
export class RowDropdownButtonItemConf {
  public static readonly ITEMS: DropdownButtonItemSettings[] = [
    {
      text: 'Insert Up',
      iconSettings: {
        svgString: INSERT_UP_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginRight: '1px'}},
      },
    },
    {
      text: 'Insert Down',
      iconSettings: {
        svgString: INSERT_DOWN_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginRight: '1px'}},
      },
    },
    {
      text: 'Move Up',
      iconSettings: {
        svgString: MOVE_UP_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginRight: '8px', marginTop: '3.5px'}},
      },
    },
    {
      text: 'Move Down',
      iconSettings: {
        svgString: MOVE_DOWN_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginLeft: '2px', marginRight: '6px', marginTop: '3.5px'}},
      },
    },
    {
      text: 'Delete',
      iconSettings: {
        svgString: TRASH_ICON_SVG_STRING,
        containerStyles: {dropdown: {marginLeft: '-4px', marginRight: '5px', marginTop: '-1px'}},
      },
    },
  ];
}
