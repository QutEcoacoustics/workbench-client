import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Description, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const contactUsEndpoint = stringTemplate`/contact_us`;

@Injectable()
export class ContactUsService extends BawFormApiService<ContactUs> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, ContactUs, injector);
  }

  public contactUs(details: ContactUs): Observable<void> {
    return this.makeFormRequest(
      contactUsEndpoint(),
      contactUsEndpoint(),
      (token) => details.getBody(token)
    ).pipe(
      // Void output
      map(() => undefined)
    );
  }

  public seed() {
    return this.getRecaptchaSeed(contactUsEndpoint());
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
  public readonly name: Param = "";
  @bawPersistAttr
  public readonly email: Param = "";
  @bawPersistAttr
  public readonly content: Description;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("data_class_contact_us[name]", this.name);
    body.set("data_class_contact_us[email]", this.email);
    body.set("data_class_contact_us[content]", this.content);
    body.set("g-recaptcha-response-data[contact_us]", this.recaptchaToken);
    body.set("g-recaptcha-response", "");
    body.set("commit", "Submit");
    body.set("authenticity_token", token);
    return body;
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
