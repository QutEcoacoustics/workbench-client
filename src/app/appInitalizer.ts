type AppInitializer = () => Promise<unknown>;

export function appInitializerFactory(isServer: boolean): AppInitializer {
  return () => initializeApp(isServer);
}

async function initializeApp(isServer: boolean): ReturnType<AppInitializer> {
  if (isServer) {
    return;
  }

  // we have dynamically imported the web components after the SSR guard
  // so that Lit doesn't try to run in an SSR context
  // If Lit does end up running inside an SSR context, it will throw an error
  // because it can't bootstrap itself to the document, and cannot find the
  // custom elements registry
  //
  // we have to use a APP_INITIALIZER so that we run the async dynamic import
  // before the app starts
  // we cannot put this in the AppComponent's ngOnInit because we need to await
  // the import to prevent race conditions
  await import("@ecoacoustics/web-components");
}
