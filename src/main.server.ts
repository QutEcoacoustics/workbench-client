/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import { enableProdMode } from "@angular/core";
import "@angular/localize/init";
import { bootstrapApplication, BootstrapContext } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { ssrConfig } from "./app/app.config.server";

if (environment.production) {
  enableProdMode();
}

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, ssrConfig, context);

export default bootstrap;
