export type CSSStyle = Partial<CSSStyleDeclaration>;

export interface StatefulCSSS<T = CSSStyle> {
  default?: T;
  hover?: T;
  click?: T;
}

export type CellCSSStyle = Omit<CSSStyle, 'width' | 'minWidth' | 'maxWidth' | 'height' | 'minHeight' | 'maxHeight'>;
