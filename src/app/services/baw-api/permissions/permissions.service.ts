import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Permission } from "@models/Permission";
import { Project } from "@models/Project";
import { Observable } from "rxjs";

const projectId: IdParam<Project> = id;
const permissionId: IdParamOptional<Permission> = id;
const endpoint = stringTemplate`/projects/${projectId}/permissions/${permissionId}${option}`;

@Injectable()
export class PermissionsService
  implements StandardApi<Permission, [IdOr<Project>]>
{
  public constructor(private api: BawApiService<Permission>) {}

  public list(project: IdOr<Project>): Observable<Permission[]> {
    return this.api.list(Permission, endpoint(project, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<Permission>,
    project: IdOr<Project>
  ): Observable<Permission[]> {
    return this.api.filter(
      Permission,
      endpoint(project, emptyParam, filterParam),
      filters
    );
  }
  public show(
    model: IdOr<Permission>,
    project: IdOr<Project>
  ): Observable<Permission> {
    return this.api.show(Permission, endpoint(project, model, emptyParam));
  }
  public create(
    model: Permission,
    project: IdOr<Project>
  ): Observable<Permission> {
    return this.api.create(
      Permission,
      endpoint(project, emptyParam, emptyParam),
      (permission) => endpoint(project, permission, emptyParam),
      model
    );
  }
  public update(
    model: Permission,
    project: IdOr<Project>
  ): Observable<Permission> {
    return this.api.update(
      Permission,
      endpoint(project, model, emptyParam),
      model
    );
  }
  public destroy(
    model: IdOr<Permission>,
    project: IdOr<Project>
  ): Observable<Permission | void> {
    return this.api.destroy(endpoint(project, model, emptyParam));
  }
}

export const permissionResolvers = new Resolvers<Permission, [IdOr<Project>]>(
  [PermissionsService],
  "permissionId",
  ["projectId"]
).create("Permission");
