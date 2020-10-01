import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";

@Component({
  selector: "app-site-card",
  template: `
    <li class="list-group-item">
      <div>
        <div class="image">
          <a id="imageLink" [routerLink]="model.getViewUrl(project)">
            <img id="image" [src]="model.image" [alt]="model.name + ' alt'" />
          </a>
        </div>
        <div class="body">
          <div class="heading">
            <a id="nameLink" [routerLink]="model.getViewUrl(project)">
              <h5 id="name">
                {{ model.name }}
              </h5>
            </a>
          </div>

          <ul class="nav nav-pills">
            <li class="nav-item" id="points">
              <span *ngIf="region" class="badge badge-pill badge-secondary">
                {{ numPoints() }} Points
              </span>
            </li>
            <li class="nav-item">
              <a
                id="details"
                class="nav-link"
                [routerLink]="model.getViewUrl(project)"
              >
                <fa-icon [icon]="['fas', 'info-circle']"></fa-icon>
                Details
              </a>
            </li>
            <li *ngIf="site" class="nav-item">
              <!-- TODO -->
              <a id="play" class="nav-link" href="not_developed">
                <fa-icon [icon]="['fas', 'play-circle']"></fa-icon>
                Play
              </a>
            </li>
            <li class="nav-item">
              <!-- TODO -->
              <a id="visualize" class="nav-link" href="not_developed">
                <fa-icon [icon]="['fas', 'eye']"></fa-icon>
                Visualise
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  `,
  styleUrls: ["./site-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteCardComponent implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  public model: Site | Region;

  public ngOnInit() {
    this.model = this.region || this.site;
  }

  public numPoints() {
    return this.region.siteIds?.size || 0;
  }
}
