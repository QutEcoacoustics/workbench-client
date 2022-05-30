import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";

@Component({
  selector: "baw-mapping-form",
  template: `
    <div class="grid-table-cell d-flex align-items-center">
      {{ mapping.path }}
    </div>
    <div class="grid-table-cell">
      <baw-site-selector
        [project]="project"
        [siteId]="mapping.siteId"
        (siteIdChange)="setSite($event)"
      ></baw-site-selector>
    </div>
    <div class="grid-table-cell">
      <baw-utc-offset-selector
        [project]="project"
        [offset]="mapping.utcOffset"
        (offsetChange)="setOffset($event)"
      ></baw-utc-offset-selector>
    </div>
  `,
})
export class HarvestMappingComponent {
  @Input() public project: Project;
  @Input() public mapping: IHarvestMapping;
  @Output() public mappingChange = new EventEmitter<IHarvestMapping>();

  public setSite(siteId: number): void {
    this.mapping.siteId = siteId ?? undefined;
    this.mappingChange.emit(this.mapping);
  }

  public setOffset(offset: string): void {
    this.mapping.utcOffset = offset;
    this.mappingChange.emit(this.mapping);
  }
}
