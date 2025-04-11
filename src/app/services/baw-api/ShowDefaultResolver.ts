import { Type } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { MonoTuple } from "@helpers/advancedTypes";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { map } from "rxjs";
import { ApiFilter } from "./api-common";
import { Filters } from "./baw-api.service";
import { BawResolver, ResolvedModel } from "./resolver-common";


/**
 * Default Resolver Class.
 * This handles generating the resolver required for fetching a the first model returned by a filter query.
 */
export class ShowDefaultResolver<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiFilter<Model, Params> = ApiFilter<
    Model, Params
  >
  > extends BawResolver<Model, Model, Params, Service, { showDefault: string; }> {
  public constructor(
    deps: Type<Service>[],
    uniqueId?: string,
    params?: MonoTuple<string, Params["length"]>
  ) {
    super(deps, uniqueId, params);
  }

  public createProviders(
    name: string,
    resolver: Type<{
    resolve: ResolveFn<ResolvedModel<Model>>;
}>,
    deps: Type<Service>[]
  ) {
    return {
      showDefault: name + "DefaultShowResolver",
      providers: [{ provide: name + "DefaultShowResolver", useClass: resolver, deps }],
    };
  }

  public create(name: string, required: true = true) {
    return super.create(name, required);
  }

  public resolverFn(_: any, api: Service, __: Id, ids: Params) {
    const filters = { paging: { items: 1 } } as Filters<Model>;
    return api.filter(filters, ...ids).pipe(map((data) => data[0]));
  }
}
