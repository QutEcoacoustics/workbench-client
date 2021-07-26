import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { CssTheme, ThemeService } from "@services/theme/theme.service";
import { List } from "immutable";
import { adminCategory, adminThemeMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";

@Component({
  selector: "baw-admin-theme-template",
  template: `
    <form class="mb-3">
      <div class="row">
        <div class="col">
          <label class="me-2 mt-1">Colour Adjustments</label>
        </div>
        <div class="col">
          <select class="form-control" (change)="onThemeChange($event)">
            <option
              *ngFor="let theme of themes"
              [selected]="theme === selectedTheme"
              [value]="theme"
            >
              {{ theme }}
            </option>
          </select>
        </div>
        <div class="col">
          <input
            type="color"
            class="form-control"
            (change)="onColorChange($event)"
          />
        </div>
      </div>
    </form>

    <div class="theme-row" *ngFor="let theme of themes">
      <ng-container *ngFor="let variant of variants">
        <div
          class="theme-box"
          [style.backgroundColor]="'var(--baw-' + theme + variant + ')'"
          [style.color]="'var(--baw-' + theme + variant + '-contrast)'"
        >
          <p>{{ theme }}{{ variant }}</p>
          <p>Sample Text</p>
        </div>
      </ng-container>
      <br />
    </div>
  `,
  styles: [
    `
      input[type="color"] {
        height: 38px;
      }

      .theme-row {
        display: flex;
        flex-direction: row;
      }

      .theme-box {
        flex: 1;
        display: inline-block;
        height: 150px;
        text-align: center;
      }
    `,
  ],
})
class AdminThemeTemplateComponent extends PageComponent implements OnInit {
  public themes: CssTheme[] = [
    "highlight",
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "light",
    "dark",
  ];
  public variants = ["", "-lighter", "-lightest", "-darker", "-darkest"];
  public selectedTheme: CssTheme = "highlight";

  public constructor(private theme: ThemeService) {
    super();
  }

  public onThemeChange(e: Event) {
    const theme: CssTheme = (e.target as HTMLSelectElement).value as CssTheme;
    console.log("theme change", e, theme);
  }

  public onColorChange(e) {
    const color = (e.target as HTMLInputElement).value;
    console.log("color change", color);
  }

  public ngOnInit(): void {}
}

AdminThemeTemplateComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List(adminMenuItemActions) },
}).andMenuRoute(adminThemeMenuItem);

export { AdminThemeTemplateComponent };
