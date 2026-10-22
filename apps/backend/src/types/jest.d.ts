/**
 * Definiciones de tipos para Jest y pruebas unitarias
 * Permite que VS Code reconozca la suite de pruebas sin errores de TypeScript
 */

declare namespace jest {
  type Mock<TReturn = any, TArgs extends any[] = any[]> = {
    (...args: TArgs): TReturn;
    mockImplementation(fn: (...args: TArgs) => any): Mock<TReturn, TArgs>;
    mockReturnValue(val: any): Mock<TReturn, TArgs>;
    mockResolvedValue(val: any): Mock<TReturn, TArgs>;
    mockRejectedValue(val: any): Mock<TReturn, TArgs>;
  };

  type Mocked<T> = {
    [P in keyof T]: T[P] extends (...args: infer Args) => infer R
      ? Mock<R, Args>
      : T[P];
  };

  function fn<T = any>(): Mock<T>;
  function spyOn<T, K extends keyof T>(object: T, method: K): Mock<any>;
}

interface JestMatchers<R> {
  toBe(expected: any): R;
  toEqual(expected: any): R;
  toBeDefined(): R;
  toBeUndefined(): R;
  toBeTruthy(): R;
  toBeFalsy(): R;
  toThrow(expected?: string | RegExp | Error): R;
  toHaveBeenCalled(): R;
  toHaveBeenCalledTimes(count: number): R;
  toHaveBeenCalledWith(...args: any[]): R;
  not: JestMatchers<R>;
  rejects: JestMatchers<Promise<R>>;
  resolves: JestMatchers<Promise<R>>;
}

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function test(name: string, fn: () => void | Promise<void>): void;
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;
declare function beforeAll(fn: () => void | Promise<void>): void;
declare function afterAll(fn: () => void | Promise<void>): void;
declare function expect<T = any>(actual: T): JestMatchers<void>;
