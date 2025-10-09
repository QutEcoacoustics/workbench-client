import { InjectionToken } from "@angular/core";
import { ApiFilter } from "@baw-api/api-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";

export type ListModel = Project | Region;

export const MODEL_LIST_SERVICE = new InjectionToken<
  ApiFilter<ListModel>
>("MODEL_LIST_SERVICE");
