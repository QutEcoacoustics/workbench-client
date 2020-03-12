import { Observable } from "rxjs";
import { AbstractModel } from "src/app/models/AbstractModel";
import { FormTemplate } from "./formTemplate";

/**
 * New Abstract Model Form
 */
export abstract class NewFormTemplate<
  M extends AbstractModel,
  F
> extends FormTemplate<M, F> {
  /**
   * Create update request
   */
  protected abstract apiCreate(event: F): Observable<M>;

  // Renaming function
  protected apiAction(event: F) {
    return this.apiCreate(event);
  }
}
