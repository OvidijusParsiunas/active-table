// WORK - rename middle to center
export type OuterContentPosition =
  | 'top-left'
  | 'top-middle'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-middle'
  | 'bottom-right';

export interface OuterContainers {
  top?: HTMLElement;
  bottom?: HTMLElement;
}
