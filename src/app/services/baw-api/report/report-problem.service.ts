import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ReportProblem } from "@models/data/ReportProblem";
import { ConfigService } from "@services/config/config.service";
import { Observable } from "rxjs";
import { catchError, first, map } from "rxjs/operators";

const reportProblemEndpoint = stringTemplate`/bug_report`;

@Injectable()
export class ReportProblemService extends BawFormApiService<ReportProblem> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    config: ConfigService
  ) {
    super(http, apiRoot, ReportProblem, injector, config);
  }

  public reportProblem(details: ReportProblem): Observable<void> {
    const validateEmail = (page: string): void => {
      const errMsg =
        'id="data_class_bug_report_email" /><span class="help-block">is invalid';
      if (page.includes(errMsg)) {
        throw Error("Email address is invalid");
      }
    };

    return this.makeFormRequest(
      reportProblemEndpoint(),
      reportProblemEndpoint(),
      (token) => details.getBody(token)
    ).pipe(
      map((page) => validateEmail(page)),
      // Complete observable
      first(),
      catchError(this.handleError)
    );
  }

  public seed() {
    return this.getRecaptchaSeed(reportProblemEndpoint());
  }
}
