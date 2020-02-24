import { ActivatedRouteSnapshot, ParamMap, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiShow, IdOr, ApiList } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

export class ListResolver<T extends AbstractModel>
  implements Resolve<ResolvedModel<T[]>> {
  constructor(
    private api: ApiList<T, any[]>,
    private ids: (params: ParamMap) => Id[]
  ) {}

  public resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ResolvedModel<T[]>> {
    return this.api.list(...this.ids(route.paramMap)).pipe(
      map(model => ({ model })),
      take(1),
      catchError((error: ApiErrorDetails) => {
        return of({ error });
      })
    );
  }
}

export class ShowResolver<T extends AbstractModel>
  implements Resolve<ResolvedModel<T>> {
  constructor(
    private api: ApiShow<T, any[], IdOr<T>>,
    private id: (params: ParamMap) => Id,
    private ids: (params: ParamMap) => Id[]
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ResolvedModel<T>> {
    return this.api
      .show(this.id(route.paramMap), ...this.ids(route.paramMap))
      .pipe(
        map(model => ({ model })),
        take(1),
        catchError((error: ApiErrorDetails) => {
          return of({ error });
        })
      );
  }
}

export interface ResolvedModel<T> {
  model?: T;
  error?: ApiErrorDetails;
}
