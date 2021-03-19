import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiService } from "@baw-api/baw-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Description, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";

const contactUsEndpoint = stringTemplate`/contact_us`;
const reportProblemEndpoint = stringTemplate`/bug_report`;

class NoModel extends AbstractModel {
  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

@Injectable()
export class ReportService extends BawApiService<NoModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, NoModel, injector);
  }

  public contactUs(details: ContactUs) {}

  public contactUsSeed() {
    return this.getRecaptchaSeed(contactUsEndpoint());
  }

  public reportProblem(details: BugReport) {}

  public reportProblemSeed() {
    return this.getRecaptchaSeed(reportProblemEndpoint());
  }
}

export interface IContactUs {
  name: Param;
  email: Param;
  content: Description;
  recaptchaToken: string;
}

export class ContactUs extends AbstractModel<IContactUs> implements IContactUs {
  public readonly kind = "ContactUs";
  @bawPersistAttr
  public readonly name: Param;
  @bawPersistAttr
  public readonly email: Param;
  @bawPersistAttr
  public readonly content: Description;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

export interface IBugReport {
  name: Param;
  email: Param;
  date: Date;
  description: Description;
  content: Description;
  recaptchaToken: string;
}

export class BugReport extends AbstractModel<IBugReport> implements IBugReport {
  public readonly kind = "BugReport";
  @bawPersistAttr
  public readonly name: Param;
  @bawPersistAttr
  public readonly email: Param;
  @bawPersistAttr
  public readonly date: Date;
  @bawPersistAttr
  public readonly description: Description;
  @bawPersistAttr
  public readonly content: Description;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
