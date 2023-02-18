import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {CSVImportButtonElement} from './importButton/CSVImportButtonElement';
import {CSVExportButtonElement} from './exportButton/CSVExportButtonElement';
import {OuterContainers} from '../../types/outerContainer';
import {ActiveTable} from '../../activeTable';

export class CSVElemets {
  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    if (!at._csv.buttons) return;
    const importButtonProps = at._csv.buttons.import;
    if (importButtonProps) {
      const buttonContainer = CSVImportButtonElement.create(at, importButtonProps);
      OuterContainerElements.addToContainer(importButtonProps.position, outerContainers, buttonContainer);
    }
    const exportButtonProps = at._csv.buttons.export;
    if (exportButtonProps) {
      const buttonElement = CSVExportButtonElement.create(at, exportButtonProps);
      OuterContainerElements.addToContainer(exportButtonProps.position, outerContainers, buttonElement);
    }
  }
}
