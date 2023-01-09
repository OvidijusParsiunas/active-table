export type PX = `${number}px` | `-${number}px`;
export type Percentage = `${number}%`;
export type StringDimension = PX | Percentage;
export type WindowDimensions = `${number}vh` | `${number}vw`;
export type FullStringDimension = StringDimension | WindowDimensions;
