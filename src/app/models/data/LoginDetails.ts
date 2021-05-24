import { Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";

export interface ILoginDetails {
  login?: Param;
  password?: Param;
}

export class LoginDetails
  extends AbstractForm<ILoginDetails>
  implements ILoginDetails {
  public readonly kind = "LoginDetails";
  @bawPersistAttr()
  public readonly login: Param;
  @bawPersistAttr()
  public readonly password: Param;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("user[login]", this.login);
    body.set("user[password]", this.password);
    body.set("user[remember_me]", "0");
    body.set("commit", "Log+in");
    body.set("authenticity_token", token);
    return body;
  }
}
