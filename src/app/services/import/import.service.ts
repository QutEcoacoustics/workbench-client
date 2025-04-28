import { Inject, Injectable } from "@angular/core";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

@Injectable({ providedIn: "root" })
export class ImportsService {
  public constructor(@Inject(IS_SERVER_PLATFORM) private isServer: boolean) {}

  public async init(): Promise<void> {
    if (this.isServer) {
      return;
    }

    // we have dynamically imported the web components after the SSR guard
    // so that Lit doesn't try to run in an SSR context
    // If Lit does end up running inside an SSR context, it will throw an error
    // because it can't bootstrap itself to the document, and cannot find the
    // custom elements registry
    //
    // we use a APP_INITIALIZER so that we can await the dynamic import to prevent
    // race conditions in defining custom elements and using the web components
    // we cannot put this in the AppComponent's ngOnInit because ngOnInit does
    // not support async operations
    //
    // there have been rare circumstances where the web components would be
    // re-declared twice, causing a hard failure of the entire website.
    // I believe this was fixed when we started bundling the web components with
    // the client bundle.
    // However, I have still added this condition as a defensive programming
    // measure so that if this bug resurfaces, it will not cause the entire
    // website to fail.
    if (customElements.get("oe-verification-grid") === undefined) {
      await import("node_modules/@ecoacoustics/web-components/dist/components.js");
    } else {
      console.warn("Attempted to import web components, but they are already defined");
      console.warn("Skipping re-declaration of web components to prevent a hard failure");
    }
  }
}
