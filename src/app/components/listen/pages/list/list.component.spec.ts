import { listenRoute } from "@components/listen/listen.menus";
import { ListenModule } from "@components/listen/listen.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { ListenComponent } from "./list.component";

describe("ListenComponent", () => {
  validateBawClientPage(
    listenRoute,
    ListenComponent,
    [ListenModule],
    "/listen",
    "Recent Audio Recordings"
  );
});
