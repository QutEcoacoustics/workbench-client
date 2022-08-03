import { Component, EventEmitter, Output } from "@angular/core";
import { ConfigService } from "@services/config/config.service";


@Component({
    selector: "baw-harvest-edit-item",
    template: `
      <div>
        <button
          type="button"
          class="btn btn-sm p-0 me-1"
          [ngbTooltip]="editTooltip"
          (click)="true"
        >
          <fa-icon [icon]="['fas', 'pen-to-square']"></fa-icon>
        </button>
      </div>
    `,

})
export class EditButtonComponent {
    @Output() public isEditTrue = new EventEmitter<boolean>();

    public constructor(
        private config: ConfigService
    ) { }

    public get editTooltip(): string {
        const modelName = this.config.settings.hideProjects ? "point" : "site";
        return `Change the ${modelName} associated with this folder path`;
    }

}
