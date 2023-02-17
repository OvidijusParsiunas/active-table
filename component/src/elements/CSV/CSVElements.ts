import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {CSVImportButtonElement} from './importButton/CSVImportButtonElement';
import {CSVExportButtonElement} from './exportButton/CSVExportButtonElement';
import {OuterContainers} from '../../types/outerContainer';
import {ActiveTable} from '../../activeTable';

export class CSVElemets {
  public static create(at: ActiveTable, outerContainers: OuterContainers) {
    if (!at._csvButtons) return;
    const importComponent = at._csvButtons.import;
    if (importComponent) {
      const buttonContainer = CSVImportButtonElement.create(at, importComponent);
      OuterContainerElements.addToContainer(importComponent.position, outerContainers, buttonContainer);
    }
    const exportComponent = at._csvButtons.export;
    if (exportComponent) {
      const buttonElement = CSVExportButtonElement.create(at, exportComponent);
      OuterContainerElements.addToContainer(exportComponent.position, outerContainers, buttonElement);
    }
  }
}
