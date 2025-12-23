import { Injectable, inject } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ContactUs } from "@models/data/ContactUs";
import { Observable } from "rxjs";

const contactUsEndpoint = stringTemplate`/contact_us`;

@Injectable()
export class ContactUsService {
  private readonly api = inject<BawFormApiService<ContactUs>>(BawFormApiService);

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
