import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Description, Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawDateTime, bawPersistAttr } from "@models/AttributeDecorators";
import { DateTime } from "luxon";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const reportProblemEndpoint = stringTemplate`/bug_report`;

@Injectable()
export class ReportProblemService extends BawFormApiService<ReportProblem> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, ReportProblem, injector);
  }

  public reportProblem(details: ReportProblem): Observable<void> {
    return this.makeFormRequest(
      reportProblemEndpoint(),
      reportProblemEndpoint(),
      (token) => details.getBody(token)
    ).pipe(
      // Void output
      map(() => undefined)
    );
  }

  public seed() {
    return this.getRecaptchaSeed(reportProblemEndpoint());
  }
}

export interface IReportProblem {
  name: Param;
  email: Param;
  date: Date | DateTime;
  description: Description;
  content: Description;
  recaptchaToken: string;
}

export class ReportProblem
  extends AbstractForm<IReportProblem>
  implements IReportProblem {
  public readonly kind = "ReportProblem";
  @bawPersistAttr
  public readonly name: Param;
  @bawPersistAttr
  public readonly email: Param;
  @bawDateTime({ persist: true })
  public readonly date: DateTime;
  @bawPersistAttr
  public readonly description: Description;
  @bawPersistAttr
  public readonly content: Description;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    this.validateRecaptchaToken();
    const body = new URLSearchParams();
    body.set("data_class_bug_report[name]", this.name ?? "");
    body.set("data_class_bug_report[email]", this.email ?? "");
    body.set("data_class_bug_report[date]", this.date.toFormat("yyyy/MM/dd"));
    body.set("data_class_bug_report[content]", this.content);
    body.set("data_class_bug_report[description]", this.description);
    body.set("g-recaptcha-response-data[bug_report]", this.recaptchaToken);
    body.set("g-recaptcha-response", "");
    body.set("commit", "Submit");
    body.set("authenticity_token", token);
    return body;
  }
}
