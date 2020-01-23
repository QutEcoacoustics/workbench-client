import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters, Path } from "./base-api.service";

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

    if (filters) {
      this.apiRequest("FILTER", next, error, path, filters);
    } else {
      this.apiRequest("LIST", next, error, path);
    }

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

    if (filters) {
      this.apiRequest("FILTER", next, error, path, filters);
    } else {
      this.apiRequest("SHOW", next, error, path);
    }

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

    this.apiRequest("CREATE", next, error, path, values);

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

    this.apiRequest("UPDATE", next, error, path, values);

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

    this.apiRequest("DELETE", next, error, path);

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
