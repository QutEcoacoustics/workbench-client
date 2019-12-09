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
          <a [routerLink]="site.getSiteUrl(project)">
            <img [src]="site.imageUrl" [alt]="site.name" />
          </a>
        </div>
        <div class="body">
          <div class="heading">
            <h5>
              <a [routerLink]="site.getSiteUrl(project)">
                {{ site.name }}
              </a>
            </h5>
          </div>

          <ul class="nav nav-pills float-right">
            <li class="nav-item">
              <a class="nav-link" [routerLink]="site.getSiteUrl(project)">
                <fa-icon [icon]="['fas', 'info-circle']"></fa-icon>
                Details
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="not_developed">
                <fa-icon [icon]="['fas', 'play-circle']"></fa-icon>
                Play
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="not_developed">
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
