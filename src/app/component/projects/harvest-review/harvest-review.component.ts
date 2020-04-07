import { Component, OnInit } from "@angular/core";
import filesize from "filesize";
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
  public filesize = filesize;
  public files: TreeNode[] = [
    {
      data: {
        name: "Creek",
        status: Status.Success,
        summary: {
          projects: new Set([]),
          sites: new Set([]),
          points: new Set([]),
          fileCount: 0,
          bytes: 0,
        },
      },
      children: [],
    },
    {
      data: {
        name: "Woodland",
        status: Status.Success,
        summary: {
          projects: new Set([]),
          sites: new Set([]),
          points: new Set([]),
          fileCount: 0,
          bytes: 0,
        },
      },
      children: [],
    },
    {
      data: {
        name: "Desert",
        status: Status.Success,
        summary: {
          projects: new Set([]),
          sites: new Set([]),
          points: new Set([]),
          fileCount: 0,
          bytes: 0,
        },
      },
      children: [],
    },
  ];
  public columns = 4;
  public status = Status;

  constructor() {}

  test(arg) {
    console.log(arg);
    return "";
  }

  ngOnInit(): void {
    const projectPool = [
      new Project({ id: 1, name: "QLD" }),
      new Project({ id: 2, name: "NSW" }),
      new Project({ id: 3, name: "TAS" }),
      new Project({ id: 4, name: "VIC" }),
      new Project({ id: 5, name: "SA" }),
      new Project({ id: 6, name: "NT" }),
      new Project({ id: 7, name: "WA" }),
    ];
    const sitePool = [
      new Site({ id: 1, name: "Avaries" }),
      new Site({ id: 2, name: "Gympie" }),
      new Site({ id: 3, name: "Woondum" }),
    ];
    const pointPool = Array.from(Array(10).keys()).map(
      (id) => new Site({ id, name: "Point" + id })
    );

    this.generateSites(
      this.files[0],
      projectPool.slice(0, 3),
      sitePool,
      pointPool
    );
    this.generateSites(
      this.files[1],
      projectPool.slice(3, 7),
      sitePool,
      pointPool
    );
    this.generateSites(
      this.files[2],
      projectPool.slice(2, 5),
      sitePool,
      pointPool
    );
  }

  private generateSites(
    parent: TreeNode,
    projectPool: Project[],
    sitePool: Site[],
    pointPool: Site[]
  ) {
    const children = [];

    for (let i = 0; i < 30; i++) {
      const child = {
        data: {
          name: `201810${i}_AAO [-27.3866 152.8761]`,
          status: Status.Success,
          summary: {
            projects: new Set([]),
            sites: new Set([]),
            points: new Set([]),
            fileCount: 0,
            bytes: 0,
          },
        },
      };

      this.generatePoints(
        child,
        (hour: number) => `201810_${hour}0000_REC [-27.3866 152.8761].flac`,
        projectPool,
        sitePool,
        pointPool
      );

      children.push(child);
    }

    // Find summary and status data
    const projects = [];
    const sites = [];
    const points = [];
    let status = Status.Success;
    children.forEach((child) => {
      if (child.data.status > status) {
        status = child.data.status;
      }

      projects.push(...child.data.summary.projects);
      sites.push(...child.data.summary.sites);
      points.push(...child.data.summary.points);
    });

    // Push worst status
    if (status > parent.data.status) {
      parent.data.status = status;
    }

    // Push summary
    parent.data.summary = {
      projects: new Set(projects),
      sites: new Set(sites),
      points: new Set(points),
      fileCount: children.length * 24,
      bytes: children.length * 24 * 31234321,
    };

    // Push children
    parent.children = children;
  }

  private generatePoints(
    parent: TreeNode,
    nameCallback: (hour: number) => string,
    projectPool: Project[],
    sitePool: Site[],
    pointPool: Site[]
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
              ? projectPool[Math.floor(Math.random() * projectPool.length)]
              : undefined,
          site:
            childStatus !== Status.Error
              ? sitePool[Math.floor(Math.random() * sitePool.length)]
              : undefined,
          point:
            childStatus === Status.Success
              ? pointPool[Math.floor(Math.random() * pointPool.length)]
              : undefined,
        },
      });

      // Update with worst status
      if (childStatus > status) {
        status = childStatus;
      }
    }

    // Push worst status
    if (status > parent.data.status) {
      parent.data.status = status;
    }

    // Push summary data
    parent.data.summary = {
      projects: new Set(
        children.map((child) => child.data.project).filter(Boolean)
      ),
      sites: new Set(children.map((child) => child.data.site).filter(Boolean)),
      points: new Set(
        children.map((child) => child.data.point).filter(Boolean)
      ),
      fileCount: children.length,
      bytes: children.length * 31234321,
    };

    // Push children
    parent.children = children;
  }
}
