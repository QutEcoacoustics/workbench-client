import { UserName, Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface IRegisterDetails {
  userName: UserName;
  email: Param;
  password: Param;
  passwordConfirmation: Param;
  recaptchaToken: string;
}

export class RegisterDetails
  extends AbstractForm<IRegisterDetails>
  implements IRegisterDetails {
  public readonly kind = "RegisterDetails";
  @bawPersistAttr()
  public readonly userName: UserName;
  @bawPersistAttr()
  public readonly email: Param;
  @bawPersistAttr()
  public readonly password: Param;
  @bawPersistAttr()
  public readonly passwordConfirmation: Param;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    this.validateRecaptchaToken();
    const body = new URLSearchParams();
    body.set("user[user_name]", this.userName);
    body.set("user[email]", this.email);
    body.set("user[password]", this.password);
    body.set("user[password_confirmation]", this.passwordConfirmation);
    body.set("commit", "Register");
    body.set("authenticity_token", token);
    body.set("g-recaptcha-response-data[register]", this.recaptchaToken);
    body.set("g-recaptcha-response", "");
    return body;
  }
}
