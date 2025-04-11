import { Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface IResetPassword {
  login: Param;
  recaptchaToken: string;
}

export class ResetPassword
  extends AbstractForm<IResetPassword>
  implements IResetPassword
{
  public readonly kind = "Reset Password";
  @bawPersistAttr()
  public readonly login: Param;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("user[login]", this.login);
    body.set("commit", "Send+me+reset+password+instructions");
    body.set("authenticity_token", token);
    return body;
  }
}
