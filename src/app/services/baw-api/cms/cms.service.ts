import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class CMS {
  public static HOME = "/";
  public static CREDITS = "/credits";
  public static DATA_UPLOAD = "/data_upload";
  public static ETHICS = "/ethics";
  public static PRIVACY = "/privacy";
}

@Injectable({
  providedIn: "root",
})
export class CmsService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public show(cms: string): Observable<SafeHtml> {
    return this.http
      .get(this.apiRoot + "/cms" + cms, { responseType: "text" })
      .pipe(
        map((response: string) =>
          this.sanitizer.bypassSecurityTrustHtml(response)
        )
      );
  }
}
