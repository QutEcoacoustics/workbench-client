import { Component, Input } from "@angular/core";
import { Project } from "@models/Project";

@Component({
  selector: "baw-harvest-title",
  template: `
    <h1>
      <small class="text-muted"> Project: {{ project.name }} </small>
      <br />
      Upload Recordings
    </h1>
  `,
})
export class TitleComponent {
  @Input() public project: Project;
}
