import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ContactUs } from "@models/data/ContactUs";
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
