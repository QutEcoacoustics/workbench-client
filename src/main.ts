import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

applyMonkeyPatches();

if (environment.production) {
  enableProdMode();
}

// Bootstrap Angular
bootstrapApplication(AppComponent, appConfig).catch((err) => {
  console.error(err);
});
