import { Params } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { toNumber } from "@helpers/typing/toNumber";
import { DateTime, Duration } from "luxon";

export type IQueryStringParameterSpec<T = Record<string, unknown>> = Partial<{
  [K in keyof T]: SerializationTechnique;
}>;

// TODO: We should probably have a function to create serializers so that we
// don't have to repeat "as const satisfies SerializationTechnique" everywhere.
export interface SerializationTechnique<Value = unknown, QSP = string> {
  serialize: (value: Value) => QSP;
  deserialize: (value: QSP) => Value;
  hasDefault?: boolean;
}

export const luxonDate = {
  serialize: dateToQueryString,
  deserialize: queryStringDate,
} as const satisfies SerializationTechnique;

export const luxonDuration = {
  serialize: durationToQueryString,
  deserialize: queryStringDurationTime,
} as const satisfies SerializationTechnique;

export const luxonDateArray = {
  serialize: dateArrayToQueryString,
  deserialize: queryStringDateArray,
} as const satisfies SerializationTechnique;

export const luxonDurationArray = {
  serialize: durationArrayToQueryString,
  deserialize: queryStringDurationTimeArray,
} as const satisfies SerializationTechnique;

export const jsNumber = {
  serialize: (value: number) => value.toString(),
  deserialize: queryStringNumber,
} as const satisfies SerializationTechnique;

export const jsBoolean = {
  serialize: (value: boolean) => value.toString(),
  deserialize: queryStringBoolean,
} as const satisfies SerializationTechnique;

export const jsString = {
  serialize: (value: string) => value,
  deserialize: (value: string) => value,
} as const satisfies SerializationTechnique;

export const jsNumberArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringToNumberArray,
} as const satisfies SerializationTechnique;

export const jsBooleanArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringToBooleanArray,
} as const satisfies SerializationTechnique;

export const jsStringArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringArray,
} as const satisfies SerializationTechnique;

/**
 * Converts a structured parameter model into an Angular `Params` object with
 * stringified values.
 *
 * You should be using this when creating query string parameters.
 */
export function serializeObjectToParams<T>(
  queryStringParameters: T,
  spec: IQueryStringParameterSpec<Partial<T>>,
): Params {
  const resultParameter: Params = {};

  // We iterate over the spec instead of using Object.entries on the
  // queryStringParameter model so that the qsp model can contain getters which
  // would not be returned by Object.entries.
  Object.entries(spec).forEach(
    ([key, serializer]: [string, SerializationTechnique]) => {
      const value = queryStringParameters[key];

      // null and undefined values are omitted when used on angular HTTPParams
      // therefore, we should not serialize them as they will have no effect on the query string
      // we use isInstantiated here because we want to serialize "falsy" values such as 0 and empty strings
      // we also omit empty arrays so that we don't end up with empty query string parameters for arrays
      if (!isInstantiated(value)) {
        return;
      }

      if (serializer) {
        const paramValue = serializer.serialize(value);
        if (!isInstantiated(paramValue)) {
          return;
        }

        resultParameter[key] = paramValue;
      }
    },
  );

  return resultParameter;
}

/**
 * Converts an object to an Angular `Params` object with stringified values into
 * a structured parameter model with computed types and objects.
 *
 * You should be using this when reading query string parameters.
 */
export function deserializeParamsToObject<T>(
  queryString: Params,
  spec: IQueryStringParameterSpec,
): T {
  const returnedObject = {};

  Object.entries(spec).forEach(([key, serializer]) => {
    const qspValue = queryString[key];
    if (!qspValue && !serializer.hasDefault) {
      return;
    }

    returnedObject[key]  = serializer.deserialize(qspValue);
  });

  return returnedObject as T;
}

export function withDefault(
  serializationTechnique: SerializationTechnique,
  defaultValue: any,
): SerializationTechnique {
  return {
    serialize: (value: any) => {
      // If the current value is the default value, we omit it from the query
      // string to reduce clutter in the URL.
      if (value === defaultValue) {
        return null;
      }

      if (!isInstantiated(value)) {
        return serializationTechnique.serialize(defaultValue);
      }

      return serializationTechnique.serialize(value);
    },
    deserialize: (value: string) => {
      if (!isInstantiated(value) || value === "") {
        return defaultValue;
      }

      return serializationTechnique.deserialize(value);
    },
    hasDefault: true,
  };
}

// individual serialization techniques for data types
function queryStringBoolean(value: string): boolean {
  return value === "true";
}

function queryStringNumber(value: string): number | null {
  return toNumber(value);
}

function queryStringArray(value: string): string[] {
  return value.split(",");
}

function queryStringToNumberArray(value: string): (number | null)[] {
  return queryStringArray(value).map(queryStringNumber);
}

function queryStringToBooleanArray(value: string): boolean[] {
  return queryStringArray(value).map(queryStringBoolean);
}

function queryStringDateArray(value: string): (DateTime | null)[] {
  return queryStringArray(value).map(queryStringDate);
}

function queryStringDate(value: string): DateTime | null {
  // if a null or undefined value is passed into luxon's DateTime.fromISO, it will return the current time
  // this can be confusing and lead to lots of bugs. We therefore return the null value here
  if (value === "") {
    return null;
  }

  return DateTime.fromISO(value, { zone: "utc" });
}

function queryStringDurationTimeArray(value: string): Duration[] {
  return queryStringArray(value).map(queryStringDurationTime);
}

function queryStringDurationTime(value: string): Duration {
  // if a null or undefined value is passed into luxon's Duration.fromISOTime, it will return the current time
  // this can be confusing and lead to lots of bugs. We therefore return the null value here
  if (value === "") {
    return null;
  }

  return Duration.fromISOTime(value);
}

// to QSP (serialization) functions
function dateToQueryString(value: DateTime): string {
  return value ? value.toFormat("yyyy-MM-dd") : "";
}

function durationToQueryString(value: Duration): string {
  return value ? value.toFormat("hh:mm") : "";
}

function dateArrayToQueryString(value: DateTime[]): string {
  return value.map((date: DateTime) => dateToQueryString(date)).join(",");
}

function durationArrayToQueryString(value: Duration[]): string {
  return value
    .map((duration: Duration) => durationToQueryString(duration))
    .join(",");
}

function arrayToQueryString(value: unknown[]): string | null {
  const valueArray = Array.from(value);
  if (valueArray.every((arrayItem) => !isInstantiated(arrayItem))) {
    return null;
  }

  return valueArray.join(",");
}
