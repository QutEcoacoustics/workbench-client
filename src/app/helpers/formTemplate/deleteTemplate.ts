import { FormTemplate } from "./formTemplate";
import { AbstractModel } from "src/app/models/AbstractModel";
import { Observable } from "rxjs";

export abstract class DeleteFormTemplate<
  M extends AbstractModel
> extends FormTemplate<M, {}> {
  /**
   * Create delete request
   * @param event Form submission
   */
  protected abstract apiDestroy(): Observable<M | void>;

  // Renaming function
  protected apiAction() {
    return this.apiDestroy();
  }
}
