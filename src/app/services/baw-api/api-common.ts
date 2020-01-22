import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { PRIMARY_OUTLET, Router } from "@angular/router";
import { Subject } from "rxjs";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";

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
  private subjectError(subject: Subject<T | T[]>, err: APIErrorDetails) {
    subject.error(err);
  }

  constructor(
    http: HttpClient,
    config: AppConfigService,
    private router: Router,
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
  protected list(path: string, filters: Filters, ...args: Args): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.apiList(next, error, path, filters);

    return subject;
  }

  /**
   * Get individual model
   * @param path URL path
   * @param filters Api Filters
   * @param args URL parameter values
   */
  protected show(path: string, filters: Filters, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.apiList(next, error, path, filters);

    return subject;
  }

  /**
   * Create a new model
   * @param path URL path
   * @param values Form details
   * @param args URL parameter values
   */
  protected new(path: string, values: any, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.apiCreate(next, error, path, values);

    return subject;
  }

  /**
   * Update a model
   * @param path URL path
   * @param values Form details
   * @param args URL parameter values
   */
  protected update(path: string, values: any, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.apiUpdate(next, error, path, values);

    return subject;
  }

  /**
   * Replace URL parameters with argument values
   * @param path URL path
   * @param args Arguments to insert
   */
  private refineUrl(path: string, args: Args): string {
    const tree = this.router.parseUrl(path);
    const segments = tree.root.children[PRIMARY_OUTLET].segments.filter(
      segment => segment.path.charAt(0) === ":"
    );

    if (args.length !== segments.length) {
      throw new Error(
        `Expected ${segments.length} arguments to satisfy url parameters for path '${path}'. Instead received ${args.length}.`
      );
    }

    args.forEach((arg, index) => {
      segments[index].path = arg.toString();
    });

    return tree.toString();
  }
}

/**
 * URL path arguments
 */
export type Args = (string | number)[];

/**
 * Api path fragment
 */
export interface Paths {
  details?: string;
  show?: string;
  new?: string;
  update?: string;
  delete?: string;
}
