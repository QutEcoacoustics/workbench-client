import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Subject } from "rxjs";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";

export let MOCK_CLASS_BUILDER = new InjectionToken("test.class.builder");

@Injectable()
export class ModelService<T> extends BawApiService {
  private subjectNext(subject: Subject<T>, data: any) {
    subject.next(this.classBuilder(data));
    subject.complete();
  }
  private subjectNextList(subject: Subject<T[]>, data: any[]) {
    subject.next(data.map(object => this.classBuilder(object)));
    subject.complete();
  }
  private subjectError(subject: Subject<T | T[]>, err: APIErrorDetails) {
    subject.error(err);
  }

  constructor(
    http: HttpClient,
    config: AppConfigService,
    @Inject(MOCK_CLASS_BUILDER) private classBuilder: (object: any) => T
  ) {
    super(http, config);
  }

  /**
   * Get list of models
   * @param path URL path
   * @param filters Api Filters
   * @param args URL parameter values
   */
  protected details(
    path: string,
    filters: Filters,
    ...args: Args
  ): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.apiDetails(next, error, path, filters);

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

    this.apiDetails(next, error, path, filters);

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
    const regex = /(:.*?)(\/|$)/;
    let count = 0;
    let attributes = regex.exec(path);

    while (attributes) {
      if (args.length > count) {
        path = path.replace(attributes[1], args[count].toString());
        attributes = regex.exec(path);
      }
      count++;
    }

    if (count !== args.length) {
      throw new Error(
        `Expected ${count} arguments to satisfy url parameters for path '${path}'. Instead received ${args.length}.`
      );
    }

    return path;
  }
}

type Args = (string | number)[];

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
