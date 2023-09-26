import {OuterDropdownButtonUtils} from '../../../../../utils/outerTableComponents/dropdown/outerDropdownButtonUtils';
import {StatefulCSSEvents} from '../../../../../utils/elements/statefulCSSEvents';
import {ExportOptions, FileFormat} from '../../../../../types/files';
import {FileExportDropdown} from '../dropdown/fileExportDropdown';
import {ActiveTable} from '../../../../../activeTable';

type ValidFormats = {[key: string]: boolean};

export class FileExportButtonElement {
  private static readonly ARROW_CONTAINER_CLASS = 'file-button-arrow-container';
  private static readonly ARROW_ICON_CLASS = 'file-button-arrow-container-icon';

  // prettier-ignore
  private static readonly VALID_FORMATS = ['csv', 'xls', 'xlsx', 'ods', 'txt']
    .reduce((acc: ValidFormats, val) => {
      acc[val] = true;
      return acc;
    }, {});

  public static createButtonArrow(button: HTMLDivElement, exportProps?: true | ExportOptions) {
    const arrow = OuterDropdownButtonUtils.createArrow(
      [FileExportButtonElement.ARROW_CONTAINER_CLASS],
      [FileExportButtonElement.ARROW_ICON_CLASS]
    );
    const styles = typeof exportProps === 'object' && exportProps.formats && exportProps.buttonArrowStyles;
    if (styles) {
      OuterDropdownButtonUtils.processAndApplyDefaultStyle(arrow, styles);
      setTimeout(() => StatefulCSSEvents.setEvents(button, styles, undefined, arrow));
    }
    return arrow;
  }

  // if there is more than 1 format - automatically create a dropdown
  public static getDropdownFormats(exportProps?: true | ExportOptions) {
    if (typeof exportProps === 'object' && exportProps.formats) {
      const {formats} = exportProps;
      const validFormats = formats.filter((format) => FileExportButtonElement.VALID_FORMATS[format.toLocaleLowerCase()]);
      if (validFormats.length > 1) {
        return validFormats;
      }
    }
    return undefined;
  }

  // prettier-ignore
  public static applyDropdown(at: ActiveTable,
      button: HTMLDivElement, container: HTMLElement, formats: FileFormat[], exportProps?: true | ExportOptions) {
    const dropdown = FileExportDropdown.create(at, button, formats);
    container.appendChild(dropdown.element);
    button.appendChild(FileExportButtonElement.createButtonArrow(button, exportProps));
  }
}
