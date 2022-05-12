import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  uploadAnnotationsProjectMenuItem,
  projectCategory,
} from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import {
  allowsOriginalDownloadWidgetMenuItem,
  permissionsWidgetMenuItem,
} from "@menu/widget.menus";
import { List } from "immutable";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Component({
  selector: "baw-project-upload-annotations",
  templateUrl: "./upload-annotations.component.html",
  styles: [
    `
      .alert {
        border: var(--baw-danger) 1px solid !important;
      }
    `,
  ],
})
class UploadAnnotationsComponent extends PageComponent {
  public showErrors: boolean;
  public errors = [
    "We could not find a column that uniquely identifies the recordings",
    "In row 64, in the name column, the value abc.wav could not be matched to any of our recordings",
    "In row 128, in the end offset column, the value 2500 is before the start offset of 2700",
  ];

  public constructor() {
    super();
  }
}

UploadAnnotationsComponent.linkToRoute({
  category: projectCategory,
  pageRoute: uploadAnnotationsProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([
      permissionsWidgetMenuItem,
      allowsOriginalDownloadWidgetMenuItem,
    ]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { UploadAnnotationsComponent };
