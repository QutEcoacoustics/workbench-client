import { Params } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { toNumber } from "@helpers/typing/toNumber";
import { DateTime, Duration } from "luxon";

export type IQueryStringParameterSpec<T = Record<string, unknown>> = {
  [K in keyof T]: ISerializationTechnique;
};

interface ISerializationTechnique {
  serialize: (value: any) => string;
  deserialize: (value: string) => any;
}

export const luxonDate = {
  serialize: dateToQueryString,
  deserialize: queryStringDate,
};

export const luxonDuration = {
  serialize: durationToQueryString,
  deserialize: queryStringDurationTime,
};

export const luxonDateArray = {
  serialize: dateArrayToQueryString,
  deserialize: queryStringDateArray,
};

export const luxonDurationArray = {
  serialize: durationArrayToQueryString,
  deserialize: queryStringDurationTimeArray,
};

export const jsNumber = {
  serialize: (value: number) => value.toString(),
  deserialize: queryStringNumber,
};

export const jsBoolean = {
  serialize: (value: boolean) => value.toString(),
  deserialize: queryStringBoolean,
};

export const jsString = {
  serialize: (value: string) => value,
  deserialize: (value: string) => value,
};

export const jsNumberArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringToNumberArray,
};

export const jsBooleanArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringToBooleanArray,
};

export const jsStringArray = {
  serialize: arrayToQueryString,
  deserialize: queryStringArray,
};

/** Converts an object to an Angular `Params` object with stringified values */
export function serializeObjectToParams<T>(
  queryStringParameters: T,
  spec: IQueryStringParameterSpec<Partial<T>>
): Params {
  const resultParameter: Params = {};

  // under our current typescript config, queryString can be undefined
  // TODO: remove as part of https://github.com/QutEcoacoustics/workbench-client/issues/2066
  if (!isInstantiated(queryStringParameters)) {
    return resultParameter;
  }

  // We iterate over the spec instead of using Object.entries on the
  // queryStringParameter model so that the qsp model can contain getters which
  // would not be returned by Object.entries.
  Object.entries(spec).forEach(
    ([key, serializationTechnique]: [string, ISerializationTechnique]) => {
      const value = queryStringParameters[key];

      // null and undefined values are omitted when used on angular HTTPParams
      // therefore, we should not serialize them as they will have no effect on the query string
      // we use isInstantiated here because we want to serialize "falsy" values such as 0 and empty strings
      // we also omit empty arrays so that we don't end up with empty query string parameters for arrays
      if (!isInstantiated(value)) {
        return;
      }

      if (serializationTechnique) {
        resultParameter[key] = serializationTechnique.serialize(value);
      }
    }
  );

  return resultParameter;
}

/** Converts a Angular `Params` object to an object with instantiated types and objects */
export function deserializeParamsToObject<T>(
  queryString: Params,
  spec: IQueryStringParameterSpec
): T {
  const returnedObject = {};

  // under our current typescript config, queryString can be undefined
  // TODO: remove as part of https://github.com/QutEcoacoustics/workbench-client/issues/2066
  if (!isInstantiated(queryString)) {
    return returnedObject as T;
  }

  Object.entries(queryString).forEach(([key, value]: [string, string]) => {
    if (key in spec) {
      const deserializationTechnique = spec[key];

      returnedObject[key] = deserializationTechnique.deserialize(value);
    }
  });

  return returnedObject as T;
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

function arrayToQueryString(value: unknown[]): string {
  return Array.from(value).join(",");
}
