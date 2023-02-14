import { Component, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { ToastrService } from "ngx-toastr";
import { takeUntil, throwError } from "rxjs";

@Component({
  selector: "baw-harvest-title",
  templateUrl: "./title.component.html",
  styleUrls: ["./title.component.scss"],
})
export class TitleComponent extends withUnsubscribe()  {
  @Input() public project: Project;
  @Input() public harvest: Harvest;

  public editingHarvestName = false;

  public constructor(
    public harvestService: ShallowHarvestsService,
    private notifications: ToastrService,
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
