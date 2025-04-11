import { libraryRoute } from "@components/library/library.menus";
import { LibraryModule } from "@components/library/library.module";
import { validateBawClientPage } from "@test/helpers/baw-client";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { LibraryComponent } from "./list.component";

describe("LibraryComponent", () => {
  validateBawClientPage(
    libraryRoute,
    LibraryComponent,
    [LibraryModule],
    "/library",
    "Annotation Library"
  );

  assertPageInfo(LibraryComponent, "Library");
});
