import { Errorable } from "@helpers/advancedTypes";
import { titleCase } from "@helpers/case-converter/case-converter";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { IPageInfo, PageInfo } from "@helpers/page/pageInfo";
import { AccessLevel } from "@interfaces/apiInterfaces";
import { MockModel } from "@models/AbstractModel.spec";
import { Project } from "@models/Project";
import { NgbTooltip, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { generateProject } from "@test/fakes/Project";
import { Subject } from "rxjs";
import { AllowsOriginalDownloadComponent } from "./allows-original-download.component";

describe("AllowsOriginalDownloadComponent", () => {
  let pageInfo$: Subject<IPageInfo>;
  let spec: Spectator<AllowsOriginalDownloadComponent>;
  const createComponent = createComponentFactory({
    component: AllowsOriginalDownloadComponent,
    imports: [NgbTooltipModule],
  });

  function setProject(project: Errorable<Project>) {
    triggerPageInfo({
      resolvers: { model: "resolver" },
      model: isBawApiError(project) ? { error: project } : { model: project },
    });
  }

  function triggerPageInfo(pageInfo: Partial<IPageInfo>) {
    pageInfo$.next(generatePageInfo(pageInfo));
  }

  beforeEach(() => {
    pageInfo$ = new Subject<PageInfo>();
    spec = createComponent({
      providers: [
        mockProvider(SharedActivatedRouteService, {
          pageInfo: pageInfo$.asObservable(),
        }),
      ],
    });
  });

  it("should not show before pageinfo observable returns", () => {
    expect(spec.query("section")).toBeFalsy();
  });

  it("should not show if page does not have project", () => {
    triggerPageInfo({
      resolvers: { model: "resolver" },
      model: { model: new MockModel({ id: 1 }) },
    });
    expect(spec.query("section")).toBeFalsy();
  });

  it("should not show if page fails to load project", () => {
    setProject(generateBawApiError());
    expect(spec.query("section")).toBeFalsy();
  });

  it("should show label if page has project", () => {
    setProject(new Project(generateProject()));
    spec.detectChanges();
    expect(spec.query("section")).toBeTruthy();
    expect(spec.query("#label")).toHaveText("Recording Downloads");
  });

  describe("access level", () => {
    [
      {
        required: AccessLevel.owner,
        userAccess: AccessLevel.owner,
        hasAccess: true,
      },
      {
        required: AccessLevel.owner,
        userAccess: AccessLevel.writer,
        hasAccess: false,
      },
      {
        required: AccessLevel.owner,
        userAccess: AccessLevel.reader,
        hasAccess: false,
      },
      {
        required: AccessLevel.writer,
        userAccess: AccessLevel.owner,
        hasAccess: true,
      },
      {
        required: AccessLevel.writer,
        userAccess: AccessLevel.writer,
        hasAccess: true,
      },
      {
        required: AccessLevel.writer,
        userAccess: AccessLevel.reader,
        hasAccess: false,
      },
      {
        required: AccessLevel.reader,
        userAccess: AccessLevel.owner,
        hasAccess: true,
      },
      {
        required: AccessLevel.reader,
        userAccess: AccessLevel.writer,
        hasAccess: true,
      },
      {
        required: AccessLevel.reader,
        userAccess: AccessLevel.reader,
        hasAccess: true,
      },
      {
        required: null,
        userAccess: AccessLevel.owner,
        hasAccess: false,
      },
      {
        required: null,
        userAccess: AccessLevel.writer,
        hasAccess: false,
      },
      {
        required: null,
        userAccess: AccessLevel.reader,
        hasAccess: false,
      },
    ].forEach(({ required, userAccess, hasAccess }) => {
      function getTooltip() {
        return spec.query(NgbTooltip).ngbTooltip;
      }

      let project: Project;
      beforeEach(() => {
        project = new Project(
          generateProject({
            allowOriginalDownload: required,
            accessLevel: userAccess,
          })
        );
      });

      describe(`allow original downloads with ${required} access level`, () => {
        describe(`when user has ${userAccess} access`, () => {
          it(`should show ${hasAccess ? "" : "not "} allowed`, () => {
            setProject(project);
            spec.detectChanges();
            expect(spec.query("#has-access")).toHaveText(
              hasAccess ? "Allowed" : "Not Allowed"
            );
          });

          it("should show tooltip", () => {
            setProject(project);
            spec.detectChanges();
            const tooltip = getTooltip();
            expect(tooltip).toContain(project.name);
            expect(tooltip).toContain(
              required ? titleCase(required) : "not set any permissions"
            );
          });
        });
      });
    });
  });
});
