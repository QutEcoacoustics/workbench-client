import {
  ActivatedRouteSnapshot,
  ParamMap,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiErrorDetails } from "../api.interceptor.service";

export class ListResolver<T extends AbstractModel>
  implements Resolve<T[] | ApiErrorDetails> {
  constructor(private api: any, private getIds: (params: ParamMap) => Id[]) {}

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
