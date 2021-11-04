import { Injector } from "@angular/core";
import { ApiFilter, ApiShow } from "@baw-api/api-common";
import {
  ApiErrorDetails,
  isApiErrorDetails,
} from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { Errorable } from "@helpers/advancedTypes";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AbstractModel, AbstractModelConstructor } from "@models/AbstractModel";
import { SpyObject } from "@ngneat/spectator";
import { Subject } from "rxjs";

/**
 * An object which keeps track of the various breakpoints set for the
 * viewport in karma.conf.js. This can be used in conjunction with
 * `viewport.set()` to change the size of the browser during unit tests
 */
export const viewports = {
  /** Bootstrap xs (w:500, h:480) */
  extraSmall: "extra-small",
  extraSmallDimensions: { width: 500, height: 480 },
  /** Bootstrap s (w:700, h:720) */
  small: "small",
  smallDimensions: { width: 700, height: 720 },
  /** Bootstrap m (w:900, h:1024) */
  medium: "medium",
  mediumDimensions: { width: 900, height: 1024 },
  /** Bootstrap l (w:1100, h:1300) */
  large: "large",
  largeDimensions: { width: 1100, height: 1300 },
  /** Bootstrap xl (w:1200, h:1500) */
  extraLarge: "extra-large",
  extraLargeDimensions: { width: 1200, height: 1500 },
};

/**
 * Default step size for timeouts
 */
export const testStepInterval = 0;

/**
 * Create an observable which will return after a number of steps
 *
 * @param subject Subject to update
 * @param callback Return value for subject
 * @param isError Call `subject.error()`
 * @param stepsRemaining Number of interval steps to wait (default = 0)
 */
export function nStepObservable<T>(
  subject: Subject<T>,
  callback: () => Errorable<T>,
  isError: boolean = false,
  stepsRemaining: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    function waitOne() {
      setTimeout(() => {
        if (stepsRemaining) {
          stepsRemaining--;
          return waitOne();
        }

        if (isError) {
          subject.error(callback() as ApiErrorDetails);
        } else {
          subject.next(callback() as T);
        }

        resolve();
      }, testStepInterval);
    }

    waitOne();
  });
}

/**
 * Handler for intercepting special api requests
 *
 * @param service Service to intercept
 * @param method Service method to intercept
 * @param injector Injector for model
 * @param models Model data
 * @param callback Model constructor
 */
export function interceptCustomApiRequest<
  Service extends any,
  Data extends any,
  Model extends AbstractModel
>(
  service: Service,
  method: keyof Service,
  injector: Injector,
  model: Errorable<Data> | Errorable<Data[]>,
  callback: AbstractModelConstructor<Model>
) {
  const subject = new Subject();
  const isError = isApiErrorDetails(model);

  let response: any;
  if (isError) {
    response = model;
  } else if (model instanceof Array) {
    response = model.map((modelData) => new callback(modelData, injector));
  } else {
    response = new callback(model, injector);
  }

  (service[method] as unknown as jasmine.Spy).and.callFake(() => subject);
  return nStepObservable(subject, () => response, isError);
}

/**
 * Handler for intercepting show api requests
 *
 * @param service Service to intercept
 * @param injector Injector for model
 * @param models Model data
 * @param callback Model constructor
 */
export function interceptShowApiRequest<
  Data extends any,
  Model extends AbstractModel
>(
  service: SpyObject<ApiShow<Model>>,
  injector: Injector,
  model: Errorable<Data>,
  callback: AbstractModelConstructor<Model>
): Promise<any> {
  return interceptCustomApiRequest(service, "show", injector, model, callback);
}

/**
 * Handler for intercepting filter api requests
 *
 * @param service Service to intercept
 * @param injector Injector for models
 * @param models Model data
 * @param callback Model constructor
 */
export function interceptFilterApiRequest<
  Data extends any,
  Model extends AbstractModel
>(
  service: SpyObject<ApiFilter<Model>>,
  injector: Injector,
  models: Errorable<Data[]>,
  callback: AbstractModelConstructor<Model>
): Promise<any> {
  return interceptCustomApiRequest(
    service,
    "filter",
    injector,
    models,
    callback
  );
}

/**
 * Handler for intercepting repeated api requests, where each result may be different
 *
 * @param apiRequestType Api Request type to intercept
 * @param responses Api responses for each recurring request
 * @param expectations Expected filter parameters for request
 */
export function interceptRepeatApiRequests<
  ModelData,
  Models extends AbstractModel | AbstractModel[]
>(
  apiRequestType: any,
  responses: (Models | ApiErrorDetails)[],
  expectations?: FilterExpectations<ModelData>[]
): Promise<void>[] {
  const subjects: Subject<Models>[] = [];
  const promises: Promise<void>[] = [];

  responses.forEach((response) => {
    const subject = new Subject<Models>();
    subjects.push(subject);
    promises.push(
      nStepObservable(subject, () => response, !(response instanceof Array))
    );
  });

  let count = -1;
  apiRequestType.andCallFake(
    (filters: Filters<ModelData>, ...params: any[]) => {
      count++;
      expectations?.[count]?.(filters, ...params);
      return subjects[count];
    }
  );

  return promises;
}

export type FilterExpectations<T> = (
  filter: Filters<T>,
  ...params: any[]
) => void;

export function getCallArgs(spy: jasmine.Spy) {
  return spy.calls.mostRecent().args;
}

export function assertOk(): void {
  expect(true).toBeTrue();
}

export function generatePageInfo(
  ...models: ResolvedModel[]
): Partial<IPageInfo> {
  const data: Partial<IPageInfo> = { resolvers: {} };

  models.forEach((model, index) => {
    const key = "model" + index;
    data.resolvers[key] = "resolver";
    data[key] = model;
  });

  return data;
}
