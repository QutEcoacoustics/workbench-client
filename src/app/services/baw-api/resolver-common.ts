import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiList, ApiShow, IdOr } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

export class Resolvers<
  T extends AbstractModel,
  S extends ApiList<T, any[]> & ApiShow<T, any[], IdOr<T>>
> {
  constructor(
    private deps: [any],
    private id?: string,
    private ids?: string[]
  ) {}

  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    const providers = [
      {
        provide: name + "sResolver",
        useClass: class Resolver extends ListResolver<T, S> {
          constructor(api: S) {
            super(api, ids);
          }
        },
        deps
      },
      {
        provide: name + "Resolver",
        useClass: class Resolver extends ShowResolver<T, S> {
          constructor(api: S) {
            super(api, id, ids);
          }
        },
        deps
      }
    ];

    console.log("Providers: ", name, providers);
    return providers;
  }
}

export class ListResolver<T extends AbstractModel, S extends ApiList<T, any[]>>
  implements Resolve<ResolvedModel<T[]>> {
  constructor(private api: S, private ids?: string[]) {}

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

export class ShowResolver<
  T extends AbstractModel,
  S extends ApiShow<T, any[], IdOr<T>>
> implements Resolve<ResolvedModel<T>> {
  constructor(private api: S, private id?: string, private ids?: string[]) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ResolvedModel<T>> {
    const showId = this.id
      ? convertToId(route.paramMap.get(this.id))
      : undefined;
    const args =
      this.id && this.ids
        ? this.ids.map(id => convertToId(route.paramMap.get(id)))
        : [];

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
