import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api/treenode";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { Status } from "../../shared/indicator/indicator.component";

@Component({
  selector: "app-project-harvest-review",
  templateUrl: "./harvest-review.component.html",
  styleUrls: ["./harvest-review.component.scss"],
})
export class HarvestReviewComponent implements OnInit {
  public files: TreeNode[] = [
    {
      data: {
        name: "Creek",
        status: Status.Success,
      },
      children: [],
    },
    {
      data: {
        name: "Woodland",
        status: Status.Success,
      },
      children: [],
    },
    {
      data: {
        name: "Desert",
        status: Status.Success,
      },
      children: [],
    },
  ];
  public columns = 4;
  public status = Status;

  constructor() {}

  ngOnInit(): void {
    this.files.forEach((file) => this.generateSites(file));
  }

  test(arg: any) {
    console.log(arg);
    return "";
  }

  private generateSites(parent: TreeNode) {
    const children = [];

    for (let i = 0; i < 30; i++) {
      const child = {
        data: {
          name: `201810${i}_AAO [-27.3866 152.8761]`,
          status: Status.Success,
        },
      };

      this.generatePoints(
        child,
        (hour: number) => `201810_${hour}0000_REC [-27.3866 152.8761].flac`
      );

      children.push(child);
    }

    let status = Status.Success;
    children.forEach((child) => {
      if (child.data.status > status) {
        status = child.data.status;
      }
    });
    if (status > parent.data.status) {
      parent.data.status = status;
    }
    parent.children = children;
  }

  private generatePoints(
    parent: TreeNode,
    nameCallback: (hour: number) => string
  ) {
    let status = Status.Success;
    const children = [];
    for (let i = 0; i < 24; i++) {
      // Randomly assign status
      let childStatus = Status.Success;
      const rand = Math.random();
      if (rand > 0.999) {
        childStatus = Status.Error;
      } else if (rand > 0.99) {
        childStatus = Status.Warning;
      }

      children.push({
        data: {
          name: nameCallback(i),
          status: childStatus,
          project:
            childStatus !== Status.Error
              ? new Project({ id: 1, name: "QLD" })
              : undefined,
          site:
            childStatus !== Status.Error
              ? new Site({ id: 1, name: "Avaries" })
              : undefined,
          point:
            childStatus === Status.Success
              ? new Site({ id: 1, name: "Currumbin NE" })
              : undefined,
        },
      });

      if (childStatus > status) {
        status = childStatus;
      }
    }

    if (status > parent.data.status) {
      parent.data.status = status;
    }
    parent.children = children;
  }
}
