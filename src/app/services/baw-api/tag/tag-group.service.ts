import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { TagGroup } from "@models/TagGroup";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolvers/resolver-common";

const tagGroupId: IdParamOptional<TagGroup> = id;
const endpoint = stringTemplate`/tag_groups/${tagGroupId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 * TODO https://github.com/QutEcoacoustics/baw-server/issues/442
 */
@Injectable()
export class TagGroupsService implements StandardApi<TagGroup> {
  public constructor(private api: BawApiService<TagGroup>) {}

  public list(): Observable<TagGroup[]> {
    return this.api.list(TagGroup, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<TagGroup>): Observable<TagGroup[]> {
    return this.api.filter(
      TagGroup,
      endpoint(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<TagGroup>): Observable<TagGroup> {
    return this.api.show(TagGroup, endpoint(model, emptyParam));
  }

  public create(model: TagGroup): Observable<TagGroup> {
    return this.api.create(
      TagGroup,
      endpoint(emptyParam, emptyParam),
      (tagGroup) => endpoint(tagGroup, emptyParam),
      model
    );
  }

  public update(model: TagGroup): Observable<TagGroup> {
    return this.api.update(TagGroup, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<TagGroup>): Observable<TagGroup | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const tagGroupResolvers = new Resolvers<TagGroup, []>(
  [TagGroupsService],
  "tagGroupId"
).create("TagGroup");
