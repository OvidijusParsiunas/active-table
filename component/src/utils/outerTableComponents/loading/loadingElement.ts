import {LoadingStyles} from '../../../types/loadingStyles';
import {GenericObject} from '../../../types/genericObject';
import {TableStyle} from '../../../types/tableStyle';
import {CSSStyle} from '../../../types/cssStyle';

export class LoadingElement {
  private static createSpinner(spinnerStyle?: CSSStyle) {
    const spinnerElement = document.createElement('span');
    spinnerElement.className = 'loading';
    Object.assign(spinnerElement.style, spinnerStyle);
    return spinnerElement;
  }

  private static applyTableStyles(styles: (keyof CSSStyleDeclaration)[], tStyle: TableStyle, loadingElement: HTMLElement) {
    styles.forEach((style) => {
      if (tStyle[style]) {
        (loadingElement.style as unknown as GenericObject)[style as string] = tStyle[style] as string;
      }
    });
  }

  // prettier-ignore
  private static createContainer(loadingStyle?: LoadingStyles, tableStyle?: TableStyle) {
    const containerElement = document.createElement('div');
    containerElement.className = 'loading-container';
    if (tableStyle) {
      LoadingElement.applyTableStyles(
        ['width', 'minWidth', 'maxHeight', 'height', 'minHeight', 'maxHeight', 'border', 'borderColor', 'borderWidth'],
        tableStyle, containerElement);
    }
    Object.assign(containerElement.style, loadingStyle?.container);
    return containerElement;
  }

  public static create(loadingStyle?: LoadingStyles, tableStyle?: TableStyle) {
    const containerElement = LoadingElement.createContainer(loadingStyle, tableStyle);
    const spinnerElement = LoadingElement.createSpinner(loadingStyle?.spinner);
    containerElement.appendChild(spinnerElement);
    return containerElement;
  }
}
