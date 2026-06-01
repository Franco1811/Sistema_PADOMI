export interface Prototype<T> {
  clone(overrides?: Partial<T>): T;
}
