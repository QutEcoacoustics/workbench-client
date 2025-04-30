import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IProject, Project } from "@models/Project";
import type { User } from "@models/User";
import { iif, Observable } from "rxjs";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { Region } from "@models/Region";
import { Id } from "@interfaces/apiInterfaces";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  param,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";
import { ShowDefaultResolver } from "../ShowDefaultResolver";

const projectId: IdParamOptional<Project> = id;
const endpoint = stringTemplate`/projects/${projectId}${option}`;
const annotationsEndpoint = stringTemplate`/projects/${projectId}/audio_events/download?${param}`;

/**
 * Projects Service.
 * Handles API routes pertaining to projects.
 */
@Injectable()
export class ProjectsService implements StandardApi<Project> {
  public constructor(private api: BawApiService<Project>) {}

  public list(): Observable<Project[]> {
    return this.api.list(Project, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Project>): Observable<Project[]> {
    return this.api.filter(Project, endpoint(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Project>): Observable<Project> {
    return this.api.show(Project, endpoint(model, emptyParam));
  }

  public create(model: Project): Observable<Project> {
    return this.api.create(
      Project,
      endpoint(emptyParam, emptyParam),
      (project) => endpoint(project, emptyParam),
      model
    );
  }

  public update(model: Project): Observable<Project> {
    return this.api.update(Project, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Project>): Observable<Project | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  /**
   * Filter projects by creator
   *
   * @param filters Project filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<IProject>,
    user: IdOr<User>
  ): Observable<Project[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "creatorId", user)
    );
  }

  public downloadAnnotations(
    model: IdOr<Project>,
    selectedTimezone: string
  ): string {
    const url = new URL(
      this.api.getPath(annotationsEndpoint(model, emptyParam))
    );
    url.searchParams.set("selected_timezone_name", selectedTimezone);
    return url.toString();
  }

  public getProjectFor(
    model: AudioRecording | Site | Region
  ): Observable<Project[]> {
    let siteIds: Id[] | undefined;

    if (model instanceof Region) {
      siteIds = Array.from(model.siteIds);
    } else if (model instanceof Site) {
      siteIds = [model.id];
    } else if (model instanceof AudioRecording) {
      siteIds = [model.siteId];
    }

    // We have to use "as any" here because inner filters do not support typing
    // for associated models.
    // see: https://github.com/QutEcoacoustics/workbench-client/issues/1777
    const filter = {
      filter: {
        "sites.id": { in: siteIds },
      } as any,
    };

    return iif(
      () => siteIds.length > 0,
      this.filter(filter),
      []
    );
  }
}

const defaultProjectResolver = new ShowDefaultResolver<
  Project,
  [],
  ProjectsService
>([ProjectsService], null).create("Project");

export const projectResolvers = new Resolvers<Project, []>(
  [ProjectsService],
  "projectId"
).create("Project", defaultProjectResolver);
