import { Component, model, output, signal } from "@angular/core";
import {
  ISelectableItem,
  SelectableItemsComponent,
} from "@shared/items/selectable-items/selectable-items.component";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { isUnresolvedModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { FormsModule } from "@angular/forms";
import { TypeaheadInputComponent } from "../../../shared/typeahead-input/typeahead-input.component";
import {
  TaskBehaviorKey,
  VerificationParameters,
  VerificationStatusKey,
} from "./verificationParameters";

@Component({
  selector: "baw-verification-form",
  templateUrl: "./verification-form.component.html",
  imports: [FormsModule, TypeaheadInputComponent, SelectableItemsComponent],
})
export class VerificationFormComponent {
  public readonly searchParameters = model.required<VerificationParameters>();
  public readonly searchParametersChange = output<VerificationParameters>();

  protected verifiedStatusOptions = signal<
    ISelectableItem<VerificationStatusKey>[]
  >([
    // I disabled prettier for this line because prettier wants to reformat the
    // "unverified-for-me" line so that each property is on its own line.
    // However, I believe this makes the code less readable because it breaks
    // the convention of the other options where each option is on its own line.
    // prettier-ignore
    { label: "have not been verified by me", value: "unverified-for-me", disabled: true },
    { label: "have not been verified by anyone", value: "unverified" },
    { label: "are verified or unverified", value: "any" },
  ]);

  protected taskBehaviorOptions: ISelectableItem<TaskBehaviorKey>[] = [
    { label: "verify", value: "verify" },
    { label: "verify and correct tag", value: "verify-and-correct-tag" },
  ];

  /**
   * A callable predicate that can be used in the template to check if the user
   * has explicitly defined a tag they are performing a verification task on.
   */
  protected hasTaskTag(): boolean {
    const taskTag = this.searchParameters().taskTagModel;

    const isResolved = !isUnresolvedModel(taskTag);
    const instantiated = isInstantiated(taskTag);

    return isResolved && instantiated;
  }

  protected updateTaskTag(newTaskTags: Tag[]): void {
    this.searchParameters.update((current) => {
      current.taskTag = newTaskTags[0]?.id ?? null;
      return current;
    });

    this.emitUpdate();
  }

  private emitUpdate() {
    this.searchParametersChange.emit(this.searchParameters());
  }
}
