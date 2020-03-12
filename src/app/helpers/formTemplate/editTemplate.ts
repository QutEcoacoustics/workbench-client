import { OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AbstractModel } from "src/app/models/AbstractModel";
import { FormTemplate } from "./formTemplate";

/**
 * Edit Abstract Model Form
 */
export abstract class EditFormTemplate<M extends AbstractModel, F>
  extends FormTemplate<M, F>
  implements OnInit {
  ngOnInit() {
    super.ngOnInit();

    // Pre-fill form if schema exists
    if (this.schema) {
      this.preFillForm();
    }
  }

  /**
   * Create update request
   * @param event Form submission
   */
  protected abstract apiUpdate(event: F): Observable<M>;

  /**
   * Pre-fill form schema with changes
   */
  protected abstract preFillForm(): void;

  // Renaming function
  protected apiAction(event: F) {
    return this.apiUpdate(event);
  }
}
