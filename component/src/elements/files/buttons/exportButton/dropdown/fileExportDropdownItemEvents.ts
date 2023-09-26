import {OuterDropdownSimpleUtils} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownSimpleUtils';
import {OuterDropdownItemEvents} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownItemEvents';
import {ActiveTable} from '../../../../../activeTable';
import {FileFormat} from '../../../../../types/files';
import {FileExportEvents} from '../fileExportEvents';

export class FileExportDropdownItemEvents {
  private static action(at: ActiveTable, targetText: string) {
    const text = targetText.toLowerCase();
    FileExportEvents.export(at, {format: text as FileFormat});
  }

  public static setEvents(at: ActiveTable, item: HTMLElement) {
    const actionFunc = FileExportDropdownItemEvents.action;
    const hideFunc = OuterDropdownSimpleUtils.hide;
    item.onmousedown = OuterDropdownItemEvents.itemMouseDownCommon.bind(at, actionFunc, hideFunc);
  }
}
