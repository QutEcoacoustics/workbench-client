import { Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface IUnlockAccount {
  login: Param;
  recaptchaToken: string;
}

export class UnlockAccount
  extends AbstractForm<IUnlockAccount>
  implements IUnlockAccount
{
  public readonly kind = "Unlock Account";
  @bawPersistAttr()
  public readonly login: Param;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("user[login]", this.login);
    body.set("commit", "Resend+unlock+instructions");
    body.set("authenticity_token", token);
    return body;
  }
}
