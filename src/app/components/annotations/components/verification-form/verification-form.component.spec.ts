import { fakeAsync } from "@angular/core/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { IconsModule } from "@shared/icons/icons.module";
import { generateTag } from "@test/fakes/Tag";
import { generateUser } from "@test/fakes/User";
import { AnnotationSearchParameters, IAnnotationSearchParameters } from "../annotation-search-form/annotationSearchParameters";
import { VerificationFormComponent } from "./verification-form.component";
import { IVerificationParameters, VerificationParameters } from "./verificationParameters";

type SupportedParams = Record<
  keyof IAnnotationSearchParameters | keyof IVerificationParameters,
  string
>;

// TODO: Finish adapting these tests to the new verification form component.
// These tests used to be a part of the annotation search form, but have been
// moved to here because we bifurcated the verification parameters into their
// own component.
xdescribe("VerificationFormComponent", () => {
  let spec: Spectator<VerificationFormComponent>;

  let mockTagsResponse: Tag[];
  let mockUser: User;

  const createComponent = createComponentFactory({
    component: VerificationFormComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi()],
  });

  const taskTagTypeahead = () => spec.query("#task-tag-input");
  const taskTagInput = () => taskTagTypeahead().querySelector("input");

  function setup(params: Partial<SupportedParams> = {}) {
    spec = createComponent({ detectChanges: false });

    const injector = spec.inject(ASSOCIATION_INJECTOR);

    const searchParameters = new AnnotationSearchParameters(params, mockUser, injector);
    const verificationParameters = new VerificationParameters(params, mockUser, injector);

    spec.setInput({
      searchParameters,
      verificationParameters,
    });

    return Promise.resolve([]);
  }

  beforeEach(() => {
    mockTagsResponse = Array.from(
      { length: 10 },
      (_, i) => new Tag(generateTag({ id: i })),
    );

    mockUser = new User(generateUser());
  });

  it("should pre-populate the tag task input if provided in the verification parameter model", fakeAsync(async () => {
    const testedTag = mockTagsResponse[0];

    const response = setup({
      tags: testedTag.id.toString(),
      taskTag: testedTag.id.toString(),
    });

    spec.detectChanges();
    await response;
    spec.detectChanges();

    expect(spec.component.verificationParameters().taskTag).toEqual(testedTag.id);
    expect(taskTagInput()).toHaveValue(testedTag.text);
  }));

  it("should show a placeholder of multiple tag if there is no tag task in the parameter model", fakeAsync(async () => {
    const response = setup({
      tags: `${mockTagsResponse[0].id},${mockTagsResponse[1].id}`,
    });

    spec.detectChanges();
    await response;
    spec.detectChanges();

    const expectedPlaceholder = `${mockTagsResponse[0].text},${mockTagsResponse[1].text}`;
    expect(taskTagInput()).toHaveProperty("placeholder", expectedPlaceholder);
  }));

  it("should show a placeholder of one tag if there is a tag task in the parameter model", fakeAsync(async () => {
    const testedTag = mockTagsResponse[0];

    const response = setup({ tags: `${testedTag.id}` });
    spec.detectChanges();
    await response;
    spec.detectChanges();

    expect(taskTagInput()).toHaveProperty("placeholder", testedTag.text);
  }));

  it("should have 'First Tag' placeholder if there are no tag parameters", fakeAsync(async () => {
    const response = setup({ tags: "" });

    spec.detectChanges();
    await response;
    spec.detectChanges();

    expect(taskTagInput()).toHaveProperty("placeholder", "First Tag");
  }));
});
