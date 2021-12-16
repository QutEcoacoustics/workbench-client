declare namespace jasmine {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<T> {
    toHaveComputedStyle(expected: Partial<CSSStyleDeclaration>): boolean;
  }
}
