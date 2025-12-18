import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { API_ROOT } from "@services/config/config.tokens";
import { Observable } from "rxjs";

/**
 * Default CMS Pages
 * The workbench server has a set of well-known pages that always exist for important pages.
 * Since we always need to fetch these core pages we've defined their slugs in-app to save time.
 * These slugs changing will be considered a breaking change in the server.
 *
 * More dynamic pages may exist in the future, in which case the CMS API will be used to discover
 * what pages are available.
 */
export enum CMS {
  home = "",
  credits = "credits",
  dataUpload = "data_upload",
  dataSharingPolicy = "data_sharing_policy",
  ethics = "ethics",
  privacy = "privacy",
}

const page = (x?: CMS) => x;
const endpoint = stringTemplate`/cms/${page}`;

@Injectable()
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly apiRoot = inject(API_ROOT);

  public get(cms: CMS): Observable<string> {
    return this.http.get(this.apiRoot + endpoint(cms), {
      responseType: "text",
    });
  }
}
