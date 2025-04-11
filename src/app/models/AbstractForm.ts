import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "./AbstractModel";
import { bawPersistAttr } from "./AttributeDecorators";

export abstract class AbstractForm<
  Model = Record<string, any>
> extends AbstractModel<Model> {
  public abstract getBody(token: string): URLSearchParams;
  @bawPersistAttr()
  public readonly recaptchaToken: string;

  public get viewUrl(): string {
    throw new Error("Method not implemented");
  }

  protected validateRecaptchaToken() {
    if (!isInstantiated(this.recaptchaToken)) {
      throw new Error("Unable to retrieve recaptcha token for sign up request");
    }
  }
}
