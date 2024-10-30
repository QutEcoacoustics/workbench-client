import { Inject, Injectable } from "@angular/core";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

@Injectable()
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
    await this.importDynamicModule("@ecoacoustics/web-components/components.js");
  }

  public async importDynamicModule(path: string): Promise<void> {
    const clientOrigin = window.location.origin;
    const importUrl = `${clientOrigin}/${path}`;

    // we have to use vite ignore so that vite doesn't bundle and cache the import
    // allowing the module to be dynamically imported
    await import(/* @vite-ignore */ importUrl);
  }
}
