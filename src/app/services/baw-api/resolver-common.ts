import { ActivatedRouteSnapshot, ParamMap, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiList, ApiShow, IdOr } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

export class ListResolver<T extends AbstractModel>
  implements Resolve<ResolvedModel<T[]>> {
  constructor(private api: ApiList<T, any[]>, private ids?: string[]) {}

  public resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ResolvedModel<T[]>> {
    const args: Id[] = this.ids
      ? this.ids.map(id => convertToId(route.paramMap.get(id)))
      : [];

    return this.api.list(...args).pipe(
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
    private id?: string,
    private ids?: string[]
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ResolvedModel<T>> {
    const showId = this.id
      ? convertToId(route.paramMap.get(this.id))
      : undefined;
    const args =
      this.id && this.ids
        ? this.ids.map(id => convertToId(route.paramMap.get(id)))
        : [];

    console.log("ShowResolver: ", showId, args);

    return this.api.show(showId, ...args).pipe(
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

function convertToId(id: string): Id {
  return parseInt(id, 10);
}
