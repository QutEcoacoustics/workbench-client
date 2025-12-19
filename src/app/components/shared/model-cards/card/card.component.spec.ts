import { fakeAsync, flush } from "@angular/core/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { StrongRoute } from "@interfaces/strongRoute";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { IUser, User } from "@models/User";
import { createRoutingFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { assetRoot } from "@services/config/config.service";
import { LicensesService } from "@services/licenses/licenses.service";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import {
  interceptShowApiRequest,
  nStepObservable,
} from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { of, Subject } from "rxjs";
import spdxLicenseList from "spdx-license-list";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let spec: Spectator<CardComponent>;
  let mockProject: Project;

  const createComponent = createRoutingFactory({
    component: CardComponent,
    providers: [provideMockBawApi()],
  });

  const getNoAudioBadge = () => spec.query<HTMLDivElement>("#no-audio");
  const getOwnerBadge = () => spec.query<HTMLDivElement>("#owner");
  const getLicenseBadges = () =>
    spec.queryAll<HTMLDivElement>(".license-badge");

  function setup(
    model: Project | Region,
    recordings: Errorable<AudioRecording[]> = [],
    userModel?: Partial<IUser>,
  ) {
    const subject = new Subject();

    spec = createComponent({
      detectChanges: false,
      props: { model },
      providers: [
        mockProvider(AudioRecordingsService, {
          filterByProject: () => subject,
          filterByRegion: () => subject,
        }),
        mockProvider(ProjectsService, {
          getProjectFor: () => of([mockProject]),
        }),
      ],
    });

    const injector = spec.inject(ASSOCIATION_INJECTOR);
    model["injector"] = injector;

    const licenseService = spec.inject(LicensesService);
    spyOn(licenseService, "availableLicenses").and.callThrough();
    spyOn(licenseService, "isSpdxLicense").and.callThrough();
    spyOn(licenseService, "licenseText").and.callThrough();
    spyOn(licenseService, "suggestedLicenses").and.callThrough();
    spyOn(licenseService, "typeaheadCallback").and.callThrough();
    licenseService["licenseIdentifiers"] = () => new Set(
      Object.keys(spdxLicenseList),
    ) as any;

    const sessionApi = spec.inject(BawSessionService);
    if (userModel) {
      const mockUser = new User(generateUser(userModel), injector);
      spyOnProperty(sessionApi, "loggedInUser", "get").and.returnValue(
        mockUser,
      );
    } else {
      spyOnProperty(sessionApi, "loggedInUser", "get").and.returnValue(
        undefined,
      );
    }

    const isProjectModel = model instanceof Project;
    const projectsApi = spec.inject(ProjectsService);
    interceptShowApiRequest(
      projectsApi,
      injector,
      isProjectModel ? model : new Project(generateProject(), injector),
      Project,
    );

    return nStepObservable(
      subject,
      () => recordings,
      isBawApiError(recordings),
    );
  }

  beforeEach(() => {
    mockProject = new Project(generateProject());
  });

  function validateCard<T extends Project | Region>(
    createModel: (data?: any) => T,
  ) {
    it("should create", () => {
      setup(createModel());
      spec.detectChanges();
      expect(spec.component).toBeTruthy();
    });

    it("should have title", () => {
      const model = createModel();
      setup(model);
      spec.detectChanges();
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText(model.name);
    });

    it("should handle local image", () => {
      const baseUrl = `${assetRoot}/broken_link`;
      const model = createModel({ imageUrls: modelData.imageUrls(baseUrl) });
      setup(model);
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      expect(image).toHaveImage(`${websiteHttpUrl}${baseUrl}/300/300`, {
        alt: `${model.name} image`,
      });
    });

    it("should display remote image", () => {
      const baseUrl = "https://broken_link/broken_link";
      const model = createModel({ imageUrls: modelData.imageUrls(baseUrl) });
      setup(model);
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      expect(image).toHaveImage(baseUrl + "/300/300", {
        alt: `${model.name} image`,
      });
    });

    it("should have default description when none provided", () => {
      setup(createModel({ descriptionHtmlTagline: undefined }));
      spec.detectChanges();

      const description = spec.query(".card-text");
      expect(description).toContainText("No description given");
    });

    it("should have description with HTML when provided", () => {
      const model = createModel();
      setup(model);
      spec.detectChanges();

      const description = spec.query(".card-text");
      expect(description.innerHTML).toContain(model.descriptionHtmlTagline);
    });

    // TODO: Assert truncation styling applies
    xit("should shorten description when description is long", () => {
      const model = createModel({
        descriptionHtmlTagline: modelData.descriptionLong(),
      });
      setup(model);
      spec.detectChanges();
    });

    it("should have image route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word(),
      );
      const model = createModel({ route: strongRoute });
      setup(model);
      spec.detectChanges();

      const route = spec.query<HTMLAnchorElement>(".card-image a");
      expect(route).toHaveUrl(model.viewUrl);
    });

    it("should have title route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word(),
      );
      const model = createModel({ route: strongRoute });
      setup(model);
      spec.detectChanges();

      const link = spec.query<HTMLAnchorElement>(".card-title");
      expect(link).toHaveUrl(model.viewUrl);
    });

    describe("owner badge", () => {
      it("should not show the owner badge when the user is logged out", () => {
        setup(createModel());
        spec.detectChanges();
        expect(getOwnerBadge()).not.toExist();
      });

      it("should not show the owner badge when the user is not the owner", () => {
        const model = createModel({
          creatorId: modelData.datatype.number(),
        });
        const userModel = generateUser({
          id: model.creatorId + 1,
        });

        setup(model, [], userModel);
        spec.detectChanges();

        expect(getOwnerBadge()).not.toExist();
      });

      it("should show owner badge when the user is the owner", () => {
        const model = createModel({
          creatorId: modelData.datatype.number(),
        });
        const userModel = generateUser({
          id: model.creatorId,
        });

        setup(model, [], userModel);
        spec.detectChanges();

        const badge = getOwnerBadge();
        expect(badge).toExist();
        expect(badge).toHaveExactTrimmedText("Owner");
      });
    });

    describe("audio recording badge", () => {
      it("should show loading badge while determining if model has recordings", () => {
        const model = createModel();
        setup(model);
        spec.detectChanges();
        assertSpinner(getNoAudioBadge(), true);
      });

      it("should show no audio badge if model has no recordings", async () => {
        const model = createModel();
        const promise = setup(model, []);
        spec.detectChanges();
        await promise;
        spec.detectChanges();

        const badge = getNoAudioBadge();
        assertSpinner(badge, false);
        expect(badge).toContainText("No audio");
      });

      it("should not show no audio badge if model has recordings", async () => {
        const model = createModel();
        const promise = setup(model, [
          new AudioRecording(generateAudioRecording()),
        ]);
        spec.detectChanges();
        await promise;
        spec.detectChanges();

        const badge = getNoAudioBadge();
        expect(badge).toBeFalsy();
      });
    });

    describe("license badge", () => {
      it("should not have a license badge if the model has no license", () => {
        setup(createModel({ license: undefined }));
        spec.detectChanges();
        const realizedBadges = getLicenseBadges();
        expect(realizedBadges).toHaveLength(0);
      });

      it("should not have a license badge if the model has an empty string license", () => {
        setup(createModel({ license: "" }));
        spec.detectChanges();
        const realizedBadges = getLicenseBadges();
        expect(realizedBadges).toHaveLength(0);
      });

      it("should display a valid license correctly", fakeAsync(() => {
        const mockLicense = modelData.licenseName();
        const model = createModel({ license: mockLicense });

        setup(model);
        spec.detectChanges();

        // flush so that the license resource completes.
        flush();
        spec.detectChanges();

        // We need to flush again so that the licenseText resource completes.
        flush();
        spec.detectChanges();

        const realizedBadges = getLicenseBadges();

        expect(realizedBadges).toHaveLength(1);
        expect(realizedBadges[0]).toHaveExactTrimmedText(mockLicense);
      }));

      it("should have the correct tooltip for license badges", fakeAsync(() => {
        const model = createModel({ license: modelData.licenseName() });
        const expectedTooltip =
          "This license has been applied to all data, metadata, and analysis results";

        setup(model);
        spec.detectChanges();

        // flush so that the license resource completes.
        flush();
        spec.detectChanges();

        // flush again so that the licenseText resource completes.
        flush();
        spec.detectChanges();

        const realizedBadges = getLicenseBadges();
        expect(realizedBadges[0]).toHaveTooltip(expectedTooltip);
      }));

      // Because the project license field is a free form text field, it is
      // possible for users to input a really long license string that would
      // appear to large in the UI.
      // TODO: Assert truncation styling applies
      xit("should shorten license when license is long", () => {
        const model = createModel({
          license: modelData.descriptionLong(),
        });
        setup(model);
        spec.detectChanges();
      });
    });
  }

  describe("Region", () => {
    validateCard((data) => {
      const licenseData = data?.license;
      if (data && "license" in data) {
        delete data.license;
      }

      mockProject = new Project(
        generateProject({ license: licenseData }),
      );

      const model = new Region(
        generateRegion({
          ...data,
          projectId: mockProject.id,
        })
      );

      return model;
    });
  });

  describe("Project", () => {
    validateCard((data) => new Project(generateProject(data ?? {})));
  });
});
