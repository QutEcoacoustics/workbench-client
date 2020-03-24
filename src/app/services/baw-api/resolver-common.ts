import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiList, ApiShow, IdOr } from "./api-common";
import { ApiErrorDetails } from "./api.interceptor.service";

/**
 * Resolvers Class.
 * This handles generating both the list and show resolves for a service.
 * Id's for the models are retrieved from the URL.
 */
export class Resolvers<
  T extends AbstractModel,
  A extends ApiList<T, any[]> & ApiShow<T, any[], IdOr<T>>
> {
  constructor(
    private deps: Type<A>[],
    private id?: string,
    private ids?: string[]
  ) {}

  /**
   * Create providers
   * @param name Name of provider
   */
  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    const listProvider = new ListResolver<T, A>(deps, ids).create(name);
    const showProvider = new ShowResolver<T, A>(deps, id, ids).create(name);
    const providers = [...listProvider.providers, ...showProvider.providers];

    return { ...listProvider, ...showProvider, providers };
  }
}

/**
 * List Resolver Class.
 * This handles generating the resolver required for generating a list of models using
 * the id's stored in the URL.
 */
export class ListResolver<
  T extends AbstractModel,
  L extends ApiList<T, any[]>
> {
  constructor(private deps: Type<L>[], private ids?: string[]) {}

  /**
   * Create provider
   * @param name Name of provider
   */
  public create(name: string) {
    const deps = this.deps;
    const ids = this.ids;

    class Resolver implements Resolve<ResolvedModel<T[]>> {
      constructor(private api: L) {}

      /**
       * Resolve the model
       * @param route Route Snapshot
       */
      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<T[]>> {
        // Grab ID's from URL
        const args: Id[] = ids
          ? ids.map(id => convertToId(route.paramMap.get(id)))
          : [];

        // Return models
        return this.api.list(...args).pipe(
          map(model => ({ model })), // Modify output to match ResolvedModel interface
          take(1), // Only take first response
          catchError((error: ApiErrorDetails) => {
            return of({ error }); // Modify output to match ResolvedModel interface
          })
        );
      }
    }

    return {
      list: name + "ListResolver",
      providers: [
        {
          provide: name + "ListResolver",
          useClass: Resolver,
          deps
        }
      ]
    };
  }
}

/**
 * Show Resolver Class.
 * This handles generating the resolver required for generating a single model using
 * the id's stored in the URL.
 */
export class ShowResolver<
  T extends AbstractModel,
  S extends ApiShow<T, any[], IdOr<T>>
> {
  constructor(
    private deps: Type<S>[],
    private id?: string,
    private ids?: string[]
  ) {}

  /**
   * Create provider
   * @param name Name of provider
   */
  public create(name: string) {
    const deps = this.deps;
    const id = this.id;
    const ids = this.ids;

    class Resolver implements Resolve<ResolvedModel<T>> {
      constructor(private api: S) {}

      /**
       * Resolve the model
       * @param route Route Snapshot
       */
      public resolve(
        route: ActivatedRouteSnapshot
      ): Observable<ResolvedModel<T>> {
        // Grab Show ID from URL
        const showId = id ? convertToId(route.paramMap.get(id)) : undefined;
        // Grab additional ID's from URL
        const args =
          id && ids
            ? ids.map(urlId => convertToId(route.paramMap.get(urlId)))
            : [];

        // Return model
        return this.api.show(showId, ...args).pipe(
          map(model => ({ model })), // Modify output to match ResolvedModel interface
          take(1), // Only take first response
          catchError((error: ApiErrorDetails) => {
            return of({ error }); // Modify output to match ResolvedModel interface
          })
        );
      }
    }

    return {
      show: name + "ShowResolver",
      providers: [
        {
          provide: name + "ShowResolver",
          useClass: Resolver,
          deps
        }
      ]
    };
  }
}

// Resolver model output
export interface ResolvedModel<T> {
  model?: T;
  error?: ApiErrorDetails;
}

/**
 * Convert URL ID param to Id type
 * @param id ID parameter
 */
function convertToId(id: string): Id {
  return parseInt(id, 10);
}
