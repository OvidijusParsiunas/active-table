import {LoadingStyles} from '../../../types/loadingStyles';
import {CSSStyle} from '../../../types/cssStyle';

export class LoadingElement {
  private static createSpinner(spinnerStyle?: CSSStyle) {
    const spinnerElement = document.createElement('span');
    spinnerElement.className = 'loading';
    Object.assign(spinnerElement.style, spinnerStyle);
    return spinnerElement;
  }

  public static create(loadingStyle?: LoadingStyles) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-container';
    Object.assign(loadingElement.style, loadingStyle?.container);
    const spinnerElement = LoadingElement.createSpinner(loadingStyle?.spinner);
    loadingElement.appendChild(spinnerElement);
    return loadingElement;
  }
}
