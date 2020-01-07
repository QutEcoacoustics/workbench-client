import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService } from "./base-api.service";

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
    private classBuilder: (object: any) => T
  ) {
    super(http, config);
  }

  /**
   * Get list of models
   * @param path URL path
   * @param args URL parameter values
   */
  protected modelDetails(path: string, ...args: Args): Subject<T[]> {
    const subject = new Subject<T[]>();
    const next = (objects: object[]) => this.subjectNextList(subject, objects);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.details(next, error, path);

    return subject;
  }

  /**
   * Get individual model
   * @param args URL parameter values
   */
  protected modelShow(path: string, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.details(next, error, path);

    return subject;
  }

  /**
   * Create a new model
   * @param values Form details
   * @param args URL parameter values
   */
  protected modelNew(path: string, values: any, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.create(next, error, path, values);

    return subject;
  }

  /**
   * Update a model
   * @param values Form details
   * @param args URL parameter values
   */
  protected modelUpdate(path: string, values: any, ...args: Args): Subject<T> {
    const subject = new Subject<T>();
    const next = (object: object) => this.subjectNext(subject, object);
    const error = (err: APIErrorDetails) => this.subjectError(subject, err);
    path = this.refineUrl(path, args);

    this.update(next, error, path, values);

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
      if (args.length === count) {
        throw new Error(
          "Model service list arguments do not match path attributes."
        );
      }

      path = path.replace(attributes[1], args[count].toString());
      attributes = regex.exec(path);
      count++;
    }

    if (count !== args.length) {
      throw new Error(
        "Number of url parameters does not match the arguments provided."
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
