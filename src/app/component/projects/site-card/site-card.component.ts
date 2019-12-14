import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";

@Component({
  selector: "app-site-card",
  template: `
    <li class="list-group-item">
      <div class="site">
        <div class="image">
          <a id="imageLink" [routerLink]="site.getSiteUrl(project)">
            <img id="image" [src]="site.imageUrl" [alt]="site.name + ' alt'" />
          </a>
        </div>
        <div class="body">
          <div class="heading">
            <a id="nameLink" [routerLink]="site.getSiteUrl(project)">
              <h5 id="name">
                {{ site.name }}
              </h5>
            </a>
          </div>

          <ul class="nav nav-pills float-right">
            <li class="nav-item">
              <a
                id="details"
                class="nav-link"
                [routerLink]="site.getSiteUrl(project)"
              >
                <fa-icon [icon]="['fas', 'info-circle']"></fa-icon>
                Details
              </a>
            </li>
            <li class="nav-item">
              <a id="play" class="nav-link" href="not_developed">
                <fa-icon [icon]="['fas', 'play-circle']"></fa-icon>
                Play
              </a>
            </li>
            <li class="nav-item">
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteCardComponent implements OnInit {
  @Input() project: Project;
  @Input() site: Site;

  constructor() {}

  ngOnInit() {}
}
