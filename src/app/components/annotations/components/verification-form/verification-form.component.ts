import {
  Component,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import {
  ISelectableItem,
  SelectableItemsComponent,
} from "@shared/items/selectable-items/selectable-items.component";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { isUnresolvedModel } from "@models/AbstractModel";
import { Tag } from "@models/Tag";
import { FormsModule } from "@angular/forms";
import { TagsService } from "@baw-api/tag/tags.service";
import { NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchParameters } from "../annotation-search-form/annotationSearchParameters";
import { TypeaheadInputComponent } from "../../../shared/typeahead-input/typeahead-input.component";
import {
  TaskBehaviorKey,
  VerificationParameters,
  VerificationStatusKey,
} from "./verificationParameters";

// This component cannot be OnPush because it uses associations which rely on
// mutable state changes.
//
// TODO: Migrate this to OnPush when associations are refactored
// see: https://github.com/QutEcoacoustics/workbench-client/issues/2148
@Component({
  selector: "baw-verification-form",
  templateUrl: "./verification-form.component.html",
  imports: [
    FormsModule,
    TypeaheadInputComponent,
    SelectableItemsComponent,
    NgbHighlight,
  ],
})
export class VerificationFormComponent {
  protected readonly tagsApi = inject(TagsService);

  public readonly searchParameters = input.required<AnnotationSearchParameters>();
  public readonly verificationParameters = model.required<VerificationParameters>();
  public readonly verificationParametersChange = output<VerificationParameters>();

  protected readonly verifiedStatusOptions: ISelectableItem<VerificationStatusKey>[] =
    [
      { label: "Improve Quality", value: "unverified-for-me" },
      { label: "Improve Coverage", value: "unverified" },
    ];

  protected readonly taskBehaviorOptions: ISelectableItem<TaskBehaviorKey>[] = [
    { label: "verify", value: "verify" },
    { label: "verify and correct tag", value: "verify-and-correct-tag" },
  ];

  /**
   * A callable predicate that can be used in the template to check if the user
   * has explicitly defined a tag they are performing a verification task on.
   */
  protected hasTaskTag(): boolean {
    const taskTag = this.verificationParameters().taskTagModel;

    const isResolved = !isUnresolvedModel(taskTag);
    const instantiated = isInstantiated(taskTag);

    return isResolved && instantiated;
  }

  protected updateTaskTag(newTaskTags: Tag[]): void {
    this.verificationParameters.update((current) => {
      current.taskTag = newTaskTags[0]?.id ?? null;
      return current;
    });

    this.emitUpdate();
  }

  protected updateTaskBehavior(newBehavior: TaskBehaviorKey): void {
    this.verificationParameters.update((current) => {
      current.taskBehavior = newBehavior;
      return current;
    });
  }

  protected updateVerificationStatus(newStatus: VerificationStatusKey): void {
    this.verificationParameters.update((current) => {
      current.verificationStatus = newStatus;
      return current;
    });
  }

  private emitUpdate() {
    this.verificationParametersChange.emit(this.verificationParameters());
  }
}
