import { listenRoute } from "@components/listen/listen.menus";
import { ListenModule } from "@components/listen/listen.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ListenComponent } from "./list.component";

describe("ListenComponent", () => {
  validateBawClientPage(
    listenRoute,
    ListenComponent,
    [ListenModule],
    "/listen",
    "Recent Audio Recordings"
  );

  assertPageInfo(ListenComponent, "Listen");
});
