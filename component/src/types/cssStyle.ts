export type CSSStyle = Partial<CSSStyleDeclaration>;

export type NoDimensionCSSStyle = Omit<CSSStyle, 'width' | 'minWidth' | 'maxWidth' | 'height' | 'minHeight' | 'maxHeight'>;

export interface StatefulCSSS<T = CSSStyle> {
  default?: T;
  hover?: T;
  click?: T;
}
