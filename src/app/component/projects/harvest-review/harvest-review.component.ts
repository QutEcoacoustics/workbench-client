import { Component, OnInit } from "@angular/core";
import filesize from "filesize";
import { TreeNode } from "primeng/api/treenode";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { Status } from "../../shared/indicator/indicator.component";
import { AbstractModel } from "src/app/models/AbstractModel";

@Component({
  selector: "app-project-harvest-review",
  templateUrl: "./harvest-review.component.html",
  styleUrls: ["./harvest-review.component.scss"],
})
export class HarvestReviewComponent implements OnInit {
  public filesize = filesize;
  public files: TreeNode[] = [];
  public columns = 4;
  public status = Status;

  constructor() {}

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

    this.generateRootFolder(
      "Creek",
      projectPool.slice(0, 3),
      sitePool,
      pointPool
    );
    this.generateRootFolder(
      "Woodland",
      projectPool.slice(3, 7),
      sitePool,
      pointPool
    );
    this.generateRootFolder(
      "Desert",
      projectPool.slice(2, 5),
      sitePool,
      pointPool
    );
  }

  private generateRootFolder(
    name: string,
    projectPool: Project[],
    sitePool: Site[],
    pointPool: Site[]
  ) {
    const { children, status, models } = this.generateFolders(
      projectPool,
      sitePool,
      pointPool
    );

    this.files.push({
      data: {
        name: name,
        status,
        ...models,
      },
      children,
    });
  }

  private generateFolders(
    projectPool: Project[],
    sitePool: Site[],
    pointPool: Site[]
  ) {
    let status: Status = Status.Success;
    const children = [];
    const models = {
      projects: new Set([]),
      sites: new Set([]),
      points: new Set([]),
    };

    for (let i = 0; i < 30; i++) {
      const {
        children: fileChildren,
        status: fileStatus,
        models: fileModels,
      } = this.generateFiles(
        (hour: number) => `201810_${hour}0000_REC [-27.3866 152.8761].flac`,
        projectPool,
        sitePool,
        pointPool
      );

      const child = {
        data: {
          name: `201810${i}_AAO [-27.3866 152.8761]`,
          status: fileStatus,
          ...fileModels,
        },
        children: fileChildren,
      };

      // Append to sets
      models.projects = union(fileModels.projects, child.data.projects);
      models.sites = union(fileModels.sites, child.data.sites);
      models.points = union(fileModels.points, child.data.points);

      // Apply worst status
      if (fileStatus > status) {
        status = fileStatus;
      }

      children.push(child);
    }

    // Return results
    return {
      children,
      status,
      models,
    };
  }

  private generateFiles(
    nameCallback: (hour: number) => string,
    projectPool: Project[],
    sitePool: Site[],
    pointPool: Site[]
  ) {
    let status = Status.Success;
    const children = [];
    const models = {
      projects: new Set([]),
      sites: new Set([]),
      points: new Set([]),
    };

    // Create children
    for (let i = 0; i < 24; i++) {
      const childStatus = this.getRandomStatus();
      const projects = this.getRandomModel(projectPool, childStatus);
      const sites = this.getRandomModel(sitePool, childStatus);
      const points = this.getRandomModel(pointPool, childStatus, true);

      children.push({
        data: {
          name: nameCallback(i),
          status: childStatus,
          projects,
          sites,
          points,
        },
      });

      // Append to sets
      models.projects = union(models.projects, projects);
      models.sites = union(models.sites, sites);
      models.points = union(models.points, points);

      // Apply worst status
      if (childStatus > status) {
        status = childStatus;
      }
    }

    // Return results
    return {
      children,
      status,
      models,
    };
  }

  private getRandomModel(
    pool: AbstractModel[],
    status: Status,
    isPoint?: boolean
  ) {
    if ((isPoint && status >= Status.Warning) || status === Status.Error) {
      return new Set([]);
    } else {
      return new Set([pool[Math.floor(Math.random() * pool.length)]]);
    }
  }

  private getRandomStatus() {
    const rand = Math.random();
    if (rand > 0.999) {
      return Status.Error;
    } else if (rand > 0.99) {
      return Status.Warning;
    } else {
      return Status.Success;
    }
  }
}

function union(setA: Set<any>, setB: Set<any>) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}
