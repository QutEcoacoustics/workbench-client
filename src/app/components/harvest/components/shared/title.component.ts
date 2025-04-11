import { Component, Input } from "@angular/core";
import { NgForm, FormsModule } from "@angular/forms";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil, throwError } from "rxjs";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
    selector: "baw-harvest-title",
    templateUrl: "./title.component.html",
    styleUrls: ["./title.component.scss"],
    imports: [FormsModule, FaIconComponent]
})
export class TitleComponent extends withUnsubscribe()  {
  @Input() public project: Project;
  @Input() public harvest: Harvest;

  public editingHarvestName = false;

  public constructor(
    public harvestService: ShallowHarvestsService,
    private notifications: ToastService,
  ){ super() }

  public updateHarvestName(form: NgForm) {
    const newHarvestName = form.value["harvestNameInput"];

    if (newHarvestName !== this.harvest.name) {
      this.harvestService.updateName(this.harvest, newHarvestName)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err: BawApiError): void => {
          throwError(() => err);
        },
      });

      this.harvest.name = newHarvestName;
      this.notifications.success(`Successfully Renamed Upload to ${this.harvest.name}`);
    }

    this.toggleHarvestNameEditing(false);
  }

  public toggleHarvestNameEditing = (state: boolean) =>
    this.editingHarvestName = state;
}
