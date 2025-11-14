type TypeofReturnType = "string" | "number" | "boolean" | "object" | "function" | "undefined";

type TypeofMapping = {
  string: string;
  number: number;
  boolean: boolean;
  object: Record<PropertyKey, unknown>;
  function: (...args: unknown[]) => unknown;
  undefined: undefined;
};

export function isDatatype<D extends TypeofReturnType>(
  value: unknown,
  datatype: D,
): value is TypeofMapping[D] {
  return typeof value === datatype;
}
