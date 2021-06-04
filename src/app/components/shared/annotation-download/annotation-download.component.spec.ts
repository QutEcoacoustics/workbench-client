import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { PageInfo } from "@helpers/page/pageInfo";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { AnnotationDownloadComponent } from "./annotation-download.component";

describe("AnnotationDownloadComponent", () => {
  let spec: Spectator<AnnotationDownloadComponent>;
  const createComponent = createComponentFactory({
    component: AnnotationDownloadComponent,
    imports: [IconsModule, MockBawApiModule],
  });

  function setup(routeData: PageInfo) {
    spec = createComponent({ detectChanges: false });
    spec.component.routeData = routeData;
  }

  it("should have annotations download in header", () => {});

  describe("close button", () => {
    it("should display in header", () => {});

    it("should dismiss component", () => {});
  });

  describe("sub title", () => {
    it("should contain sub title", () => {});

    it("should not refer to points if region is defined", () => {});

    it("should not refer to sites if region is not defined", () => {});
  });

  describe("form", () => {
    it("should have timezone input", () => {});

    it("should default to UTC if no timezone exists for site", () => {});

    it("should default to UTC if no timezone exists for point", () => {});
  });

  describe("submission", () => {
    it("should call downloadAnnotations on submission", () => {});

    it("should call downloadAnnotations with site", () => {});

    it("should call downloadAnnotations with project if region does not exist", () => {});

    it("should call downloadAnnotations with regions project if region exists", () => {});

    it("should call downloadAnnotations with timezone", () => {});
  });

  describe("modal", () => {
    it("inserts successfully into bootstrap modal", () => {});
  });
});
