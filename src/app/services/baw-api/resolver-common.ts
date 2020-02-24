import { ActivatedRouteSnapshot, ParamMap, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiList } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

type Constructor<T = {}> = new (...args: any[]) => T;

export function listResolver<T extends Constructor>(base: T) {
  return class extends base {
    private api: ApiList<any, any>;
    private getIds: (params: ParamMap) => Id[];

    constructor(...args: any[]) {
      super(...args);
      this.api = args[0];
      this.getIds = args[1];
    }

    public resolve(
      route: ActivatedRouteSnapshot
    ): Observable<any[] | ApiErrorDetails> {
      const ids = this.getIds(route.paramMap);

      return this.api.list(...ids).pipe(
        take(1),
        catchError((err: ApiErrorDetails) => {
          return of(err);
        })
      );
    }
  };
}

export class ListResolver<T extends AbstractModel>
  implements Resolve<T[] | ApiErrorDetails> {
  constructor(
    protected api: any,
    protected getIds: (params: ParamMap) => Id[]
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<T[]> {
    const ids = this.getIds(route.paramMap);

    return this.api.list(...ids).pipe(
      take(1),
      catchError((err: ApiErrorDetails) => {
        return of(err);
      })
    );
  }
}

export class ShowResolver<T extends AbstractModel>
  implements Resolve<T | ApiErrorDetails> {
  constructor(private api: any, private getIds: (params: ParamMap) => Id[]) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<T> {
    const ids = this.getIds(route.paramMap);

    return this.api.show(...ids).pipe(
      take(1),
      catchError((err: ApiErrorDetails) => {
        return of(err);
      })
    );
  }
}
