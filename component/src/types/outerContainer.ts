export type OuterContentPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface OuterContainers {
  top?: HTMLElement;
  bottom?: HTMLElement;
}
