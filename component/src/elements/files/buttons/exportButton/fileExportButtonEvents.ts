import {XLSInternalUtils} from '../../../../utils/outerTableComponents/XLS/XLSInternalUtils';
import {XLSExport} from '../../../../utils/outerTableComponents/XLS/XLSExport';
import {ActiveTable} from '../../../../activeTable';

export class FileExportButtonEvents {
  private static buttonClick(at: ActiveTable, fileName?: string) {
    XLSInternalUtils.execFuncWithExtractorModule(XLSExport.export.bind(this, at, false, fileName));
  }

  public static setEvents(at: ActiveTable, buttonElement: HTMLElement, fileName?: string) {
    buttonElement.onclick = FileExportButtonEvents.buttonClick.bind(this, at, fileName);
  }
}
