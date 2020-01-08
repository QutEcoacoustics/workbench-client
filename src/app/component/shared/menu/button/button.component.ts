import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { Params, Router } from "@angular/router";
import { MenuAction } from "src/app/interfaces/menusInterfaces";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { UserService } from "src/app/services/baw-api/user.service";

@Component({
  selector: "app-menu-button",
  template: `
    <button
      class="btn text-left"
      (click)="link.action(services, params)"
      [ngbTooltip]="tooltip"
      [placement]="placement"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ tooltip }}
      </span>
    </button>
  `,
  styleUrls: ["./button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent implements OnInit {
  @Input() id: string;
  @Input() link: MenuAction;
  @Input() placement: "left" | "right";
  @Input() tooltip: string;
  @Input() params: Params;

  services = {};

  constructor(
    private api: BawApiService,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService,
    private userApi: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.services["api"] = this.api;
    this.services["projects"] = this.projectsApi;
    this.services["sites"] = this.sitesApi;
    this.services["user"] = this.userApi;
    this.services["router"] = this.router;
  }
}
