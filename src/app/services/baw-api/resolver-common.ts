import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiList, ApiShow, IdOr } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

export class Resolvers<
  T extends AbstractModel,
  A extends ApiList<T, any[]> & ApiShow<T, any[], IdOr<T>>
> {
  constructor(
    private deps: Type<A>[],
    private id?: string,
    private ids?: string[]
  ) {}

  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    const listProvider = new ListResolver<T, A>(deps, ids).create(name);
    const showProvider = new ShowResolver<T, A>(deps, id, ids).create(name);

    return [...listProvider, ...showProvider];
  }
}

export class ListResolver<
  T extends AbstractModel,
  L extends ApiList<T, any[]>
> {
  constructor(private deps: Type<L>[], private ids?: string[]) {}

  public create(name: string) {
    const deps = this.deps;
    const ids = this.ids;

    class Resolver implements Resolve<ResolvedModel<T[]>> {
      constructor(private api: L) {}

      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<T[]>> {
        const args: Id[] = ids
          ? ids.map(id => convertToId(route.paramMap.get(id)))
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

    return [
      {
        provide: name + "ListResolver",
        useClass: Resolver,
        deps
      }
    ];
  }
}

export class ShowResolver<
  T extends AbstractModel,
  S extends ApiShow<T, any[], IdOr<T>>
> {
  constructor(
    private deps: Type<S>[],
    private id?: string,
    private ids?: string[]
  ) {}

  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    class Resolver implements Resolve<ResolvedModel<T>> {
      constructor(private api: S) {}

      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<T>> {
        const showId = id ? convertToId(route.paramMap.get(id)) : undefined;
        const args =
          id && ids ? ids.map(id => convertToId(route.paramMap.get(id))) : [];

        return this.api.show(showId, ...args).pipe(
          map(model => ({ model })),
          take(1),
          catchError((error: ApiErrorDetails) => {
            return of({ error });
          })
        );
      }
    }

    return [
      {
        provide: name + "ShowResolver",
        useClass: Resolver,
        deps
      }
    ];
  }
}

export interface ResolvedModel<T> {
  model?: T;
  error?: ApiErrorDetails;
}

function convertToId(id: string): Id {
  return parseInt(id, 10);
}
