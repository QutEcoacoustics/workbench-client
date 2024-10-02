import { createComponentFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { generateAnnotationSearchParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { Injector, INJECTOR } from "@angular/core";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { AnnotationSearchFormComponent } from "./annotation-search-form.component";

describe("AnnotationSearchFormComponent", () => {
  let spectator: Spectator<AnnotationSearchFormComponent>;
  let injector: SpyObject<Injector>;
  let defaultFakeProject: Project;

  const createComponent = createComponentFactory({
    component: AnnotationSearchFormComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injector = spectator.inject(INJECTOR);

    spectator.component.project = defaultFakeProject;
    spectator.component.searchParameters = new AnnotationSearchParameters(
      generateAnnotationSearchParameters(),
      injector,
    );

    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultFakeProject = new Project(generateProject());

    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationSearchFormComponent);
  });
});
