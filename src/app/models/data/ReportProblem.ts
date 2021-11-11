import { Param, Description } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr, bawDateTime } from "@models/AttributeDecorators";
import { DateTime } from "luxon";

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
  implements IReportProblem
{
  public readonly kind = "Report Problem";
  @bawPersistAttr()
  public readonly name: Param;
  @bawPersistAttr()
  public readonly email: Param;
  @bawDateTime({ persist: true })
  public readonly date: DateTime;
  @bawPersistAttr()
  public readonly description: Description;
  @bawPersistAttr()
  public readonly content: Description;
  @bawPersistAttr()
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
