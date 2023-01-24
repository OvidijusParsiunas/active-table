export type SortingFunc = (cellText1: string, cellText2: string) => number;

export interface Sorting {
  // The functions are expected to return a negative value if cellText1 is less than cellText2, zero if both arguments
  // are equal, or a positive value if cellText1 is greater than cellText2.
  // The reason why the arguments are of string type is because cell dom elements store text in a string format, hence
  // instead of attempting to infer the correct type ourselves, we leave it to the consumer to infer the data they
  // want to and give them full control over the sorting functionality.
  // IMPORTANT - if utilizing regex inside the function, make sure the escape characters are padded, e.g: \ => \\
  ascendingFunc: SortingFunc;
  descendingFunc: SortingFunc;
}
