import { Param, Description } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface IContactUs {
  name: Param;
  email: Param;
  content: Description;
  recaptchaToken: string;
}

export class ContactUs extends AbstractForm<IContactUs> implements IContactUs {
  public readonly kind = "Contact Us";
  @bawPersistAttr()
  public readonly name: Param = "";
  @bawPersistAttr()
  public readonly email: Param = "";
  @bawPersistAttr()
  public readonly content: Description;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    this.validateRecaptchaToken();
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
}
