import { Component, inject } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { CacheSettings, CACHE_SETTINGS } from "@services/cache/cache-settings";
import { List } from "immutable";
import { adminCategory } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";
import { adminSettingsMenuItem } from "./settings.menus";

@Component({
  template: `
    <h1>Client Settings</h1>

    <p class="subTitle">
      This page allows for you to modify settings of the website in real time.
      However, they will only affect your browser, and will be reset on a page
      refresh. These features should be considered as debugging tools only.
    </p>

    <h2>Caching</h2>

    <div class="form-check">
      <input
        id="enable-cache"
        class="form-check-input"
        type="checkbox"
        [checked]="cacheSettings.enabled"
        (change)="cacheSettings.setCaching($any($event.target).checked)"
      />
      <label class="form-check-label" for="enable-cache">
        Enable caching of API requests
      </label>
    </div>

    <div class="form-check">
      <input
        id="enable-cache-logging"
        class="form-check-input"
        type="checkbox"
        [checked]="cacheSettings.showLogging"
        [disabled]="!cacheSettings.enabled"
        (change)="cacheSettings.setLogging($any($event.target).checked)"
      />
      <label class="form-check-label" for="enable-cache-logging">
        Enable cache logging in the console
      </label>
    </div>
  `,
})
class AdminSettingsComponent extends PageComponent {
  public readonly cacheSettings = inject<CacheSettings>(CACHE_SETTINGS);
}

AdminSettingsComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminSettingsMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminSettingsComponent };
