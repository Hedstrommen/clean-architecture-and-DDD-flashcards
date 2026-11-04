declare const brand: unique symbol;

export type Branded<T, B extends string> = T & { readonly [brand]: B };

export const brandId = <B extends string>(value: string): Branded<string, B> =>
  value as Branded<string, B>;

export const unbrand = (value: Branded<string, string>): string => value as string;
