import {OuterContainerElements} from '../../utils/outerTableComponents/outerContainerElements';
import {CSVImportButtonElement} from './CSVImportButtonElement';
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
    if (at._csvButtons.export?.position) {
      // OuterContainerElements.addToContainer(at._csvButtons.export.position, outerContainers, buttonContainer);
    }
  }
}
