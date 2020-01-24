import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters, Path } from "./base-api.service";

/**
 * Abstract API Class
 */
export abstract class AbstractApi<T> extends BawApiService {
  constructor(
    http: HttpClient,
    config: AppConfigService,
    protected allPath: Path,
    protected idPath: Path,
    protected type: new (object: any) => T
  ) {
    super(http, config);
  }

  /**
   * Call subject.next() with single model data
   * @param subject Subject
   * @param data Data
   */
  protected subjectNext(subject: Subject<T>, data: any) {
    subject.next(new this.type(data));
    subject.complete();
  }

  /**
   * Call subject.next() with model data list
   * @param subject Subject
   * @param data Data
   */
  protected subjectNextList(subject: Subject<T[]>, data: any[]) {
    subject.next(data.map(object => new this.type(object)));
    subject.complete();
  }

  /**
   * Call subject.next() with boolean result
   * @param subject Subject
   * @param data Data
   */
  protected subjectNextBoolean(subject: Subject<boolean>, data: any) {
    subject.next(!!data);
    subject.complete();
  }

  /**
   * Call subject.error() with error result
   * @param subject Subject
   * @param err Error
   */
  protected subjectError(subject: Subject<any>, err: APIErrorDetails) {
    subject.error(err);
  }
}

/**
 * API List functionality
 */
class ApiList<T> extends AbstractApi<T> {
  /**
   * Get list of models
   * @param args URL parameter values
   */
  public list(...args: Args): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiList(next, error, this.allPath(...args));

    return subject;
  }
}

/**
 * API Filter functionality
 */
class ApiFilter<T> extends AbstractApi<T> {
  /**
   * Get filtered list of models
   * @param filters Api Filters
   * @param args URL parameter values
   */
  public filter(filters: Filters, ...args: Args): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiList(next, error, this.allPath(...args), filters);

    return subject;
  }
}

/**
 * API Show functionality
 */
class ApiShow<T> extends AbstractApi<T> {
  /**
   * Get individual model
   * @param id Model ID
   * @param args URL parameter values
   */
  public show(id: ID, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiList(next, error, this.idPath(id, ...args));

    return subject;
  }
}

/**
 * API New functionality
 */
class ApiNew<T> extends AbstractApi<T> {
  /**
   * Create a new model
   * @param values Form details
   * @param args URL parameter values
   */
  public new(values: any, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiCreate(next, error, this.allPath(...args), values);

    return subject;
  }
}

/**
 * API Update functionality
 */
class ApiUpdate<T> extends AbstractApi<T> {
  /**
   * Update a model
   * @param values Form details
   * @param id Model ID
   * @param args URL parameter values
   */
  public update(values: any, id: ID, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiUpdate(next, error, this.idPath(id, ...args), values);

    return subject;
  }
}

/**
 * API Delete functionality
 */
class ApiDelete<T> extends AbstractApi<T> {
  /**
   * Delete a model
   * @param id Model ID
   * @param args URL parameter values
   */
  public delete(id: ID, ...args: Args): Subject<boolean> {
    const subject = new Subject<boolean>();
    const next = (success: boolean) =>
      this.subjectNextBoolean(subject, success);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiDelete(next, error, this.idPath(id, ...args));

    return subject;
  }
}

export abstract class StandardApi<T> extends AbstractApi<T>
  implements ApiList<T>, ApiShow<T>, ApiNew<T>, ApiUpdate<T>, ApiDelete<T> {
  public list: (...args: Args) => Subject<T[]>;
  public filter: (filters: Filters, ...args: Args) => Subject<T[]>;
  public show: (...args: Args) => Subject<T>;
  public new: (values: any, ...args: Args) => Subject<T>;
  public update: (values: any, ...args: Args) => Subject<T>;
  public delete: (id: ID, ...args: Args) => Subject<boolean>;
}
applyMixins(StandardApi, [
  ApiList,
  ApiFilter,
  ApiShow,
  ApiNew,
  ApiUpdate,
  ApiDelete
]);

export let STUB_CLASS_BUILDER = new InjectionToken("test.class.builder");

@Injectable()
export class ApiCommon<T> extends BawApiService {
  private subjectNext(subject: Subject<T>, data: any) {
    subject.next(new this.type(data));
    subject.complete();
  }
  private subjectNextList(subject: Subject<T[]>, data: any[]) {
    subject.next(data.map(object => new this.type(object)));
    subject.complete();
  }
  private subjectNextBoolean(subject: Subject<boolean>, data: any) {
    subject.next(!!data);
    subject.complete();
  }
  private subjectError(subject: Subject<any>, err: APIErrorDetails) {
    subject.error(err);
  }

  constructor(
    http: HttpClient,
    config: AppConfigService,
    @Inject(STUB_CLASS_BUILDER) private type: new (object: any) => T
  ) {
    super(http, config);
  }

  /**
   * Get list of models
   * @param path URL path
   * @param filters Api Filters
   * @param args URL parameter values
   */
  protected list(path: string, filters: Filters): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiList(next, error, path, filters);

    return subject;
  }

  /**
   * Get individual model
   * @param path URL path
   * @param filters Api Filters
   * @param args URL parameter values
   */
  protected show(path: string, filters: Filters): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiList(next, error, path, filters);

    return subject;
  }

  /**
   * Create a new model
   * @param path URL path
   * @param values Form details
   * @param args URL parameter values
   */
  protected new(path: string, values: any): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiCreate(next, error, path, values);

    return subject;
  }

  /**
   * Update a model
   * @param path URL path
   * @param values Form details
   * @param args URL parameter values
   */
  protected update(path: string, values: any): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiUpdate(next, error, path, values);

    return subject;
  }

  /**
   * Delete a model
   * @param path URL path
   * @param args URL parameter values
   */
  protected delete(path: string): Subject<boolean> {
    const subject = new Subject<boolean>();
    const next = (success: boolean) =>
      this.subjectNextBoolean(subject, success);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);

    this.apiDelete(next, error, path);

    return subject;
  }
}

/**
 * URL path arguments
 */
export type Args = (string | number)[];

/**
 * Default api paths
 */
export interface CommonApiPaths {
  details?: Path;
  nestedDetails?: Path;
  show?: Path;
  nestedShow?: Path;
  new?: Path;
  nestedNew?: Path;
  update?: Path;
  nestedUpdate?: Path;
  delete?: Path;
  nestedDelete?: Path;
}

/**
 * Apply mixins to derived class. This add implementations to class functions.
 * @param derivedCtor Derived Class
 * @param baseCtors Base Class
 */
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== "constructor") {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}
