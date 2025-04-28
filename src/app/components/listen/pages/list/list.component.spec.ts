import { listenRoute } from "@components/listen/listen.menus";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ListenComponent } from "./list.component";

describe("ListenComponent", () => {
  validateBawClientPage(
    listenRoute,
    ListenComponent,
    "/listen",
    "Recent Audio Recordings"
  );

  assertPageInfo(ListenComponent, "Listen");
});
