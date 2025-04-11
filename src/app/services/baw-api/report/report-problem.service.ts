import { Injectable } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ReportProblem } from "@models/data/ReportProblem";
import { Observable } from "rxjs";
import { catchError, first, map } from "rxjs/operators";

const reportProblemEndpoint = stringTemplate`/bug_report`;

@Injectable()
export class ReportProblemService {
  public constructor(private api: BawFormApiService<ReportProblem>) {}

  public reportProblem(details: ReportProblem): Observable<void> {
    const validateEmail = (page: string): void => {
      const errMsg = 'id="data_class_bug_report_email" /><span class="help-block">is invalid';
      if (page.includes(errMsg)) {
        throw Error("Email address is invalid");
      }
    };

    return this.api
      .makeFormRequest(reportProblemEndpoint(), reportProblemEndpoint(), (token) => details.getBody(token))
      .pipe(
        map((page) => validateEmail(page)),
        // Complete observable
        first(),
        catchError(this.api.handleError),
      );
  }

  public seed() {
    return this.api.getRecaptchaSeed(reportProblemEndpoint());
  }
}
