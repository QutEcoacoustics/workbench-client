import { Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface IConfirmPassword {
  login: Param;
  recaptchaToken: string;
}

export class ConfirmPassword
  extends AbstractForm<IConfirmPassword>
  implements IConfirmPassword {
  public readonly kind = "ConfirmPassword";
  @bawPersistAttr()
  public readonly login: Param;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("user[login]", this.login);
    body.set("commit", "Resend+confirmation+instructions");
    body.set("authenticity_token", token);
    return body;
  }
}
