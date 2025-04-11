import { Injectable } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ContactUs } from "@models/data/ContactUs";
import { Observable } from "rxjs";

const contactUsEndpoint = stringTemplate`/contact_us`;

@Injectable()
export class ContactUsService {
  public constructor(private api: BawFormApiService<ContactUs>) {}

  public contactUs(details: ContactUs): Observable<void> {
    return this.api.makeFormRequestWithoutOutput(
      contactUsEndpoint(),
      contactUsEndpoint(),
      (token) => details.getBody(token)
    );
  }

  public seed() {
    return this.api.getRecaptchaSeed(contactUsEndpoint());
  }
}
