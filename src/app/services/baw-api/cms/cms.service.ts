import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
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
  HOME = "",
  CREDITS = "credits",
  DATA_UPLOAD = "data_upload",
  ETHICS = "ethics",
  PRIVACY = "privacy",
}

const page = (x?: CMS) => x;
const endpoint = stringTemplate`/cms/${page}`;

@Injectable()
export class CmsService {
  constructor(
    private http: HttpClient,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public get(cms: CMS): Observable<string> {
    return this.http.get(this.apiRoot + endpoint(cms), {
      // Set response type so that interceptor can identify this is not
      // json traffic
      responseType: "text",
    });
  }
}
