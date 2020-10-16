import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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
    private sanitizer: DomSanitizer,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public get(cms: CMS): Observable<SafeHtml> {
    return this.http
      .get(this.apiRoot + endpoint(cms), { responseType: "text" })
      .pipe(
        map((response: string) =>
          this.sanitizer.bypassSecurityTrustHtml(response)
        )
      );
  }
}
