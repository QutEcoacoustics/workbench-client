import { Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DirectivesModule } from "@directives/directives.module";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from "@ngneat/spectator";
import {
  Breadcrumb,
  BreadcrumbsData,
  MenuService,
  MenuServiceData,
} from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { IconsModule } from "@shared/icons/icons.module";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { assertIcon, assertStrongRouteLink } from "@test/helpers/html";
import { OrderedSet } from "immutable";
import { Subject } from "rxjs";
import { BreadcrumbComponent } from "./breadcrumb.component";

describe("BreadcrumbComponent", () => {
  let subjects: {
    queryParams: Subject<Params>;
    routeParams: Subject<Params>;
    menuUpdate: Subject<MenuServiceData>;
  };
  let spec: Spectator<BreadcrumbComponent>;
  const createComponent = createComponentFactory({
    component: BreadcrumbComponent,
    imports: [DirectivesModule, IconsModule, RouterTestingModule],
  });

  function triggerQueryParams(params: Params) {
    return nStepObservable(subjects.queryParams, () => params, false);
  }

  function triggerRouteParams(params: Params) {
    return nStepObservable(subjects.routeParams, () => params, false);
  }

  function triggerBreadcrumbs(breadcrumbs: BreadcrumbsData) {
    return nStepObservable(
      subjects.menuUpdate,
      () =>
        ({
          breadcrumbs,
        } as Partial<MenuServiceData> as MenuServiceData),
      false
    );
  }

  function getBreadcrumbs() {
    return spec.queryAll("li");
  }

  function generateBreadcrumb(): Breadcrumb {
    return {
      label: modelData.random.word(),
      icon: modelData.icon(),
      route: StrongRoute.newRoot().addFeatureModule(modelData.random.word()),
    };
  }

  beforeEach(() => {
    subjects = {
      queryParams: new Subject(),
      routeParams: new Subject(),
      menuUpdate: new Subject(),
    };

    spec = createComponent({
      providers: [
        mockProvider(SharedActivatedRouteService, {
          queryParams: subjects.queryParams,
          params: subjects.routeParams,
        }),
        mockProvider(MenuService, {
          menuUpdate: subjects.menuUpdate,
        }),
      ],
    });
    spec.detectChanges();
  });

  it("should not show breadcrumbs if no links exist", async () => {
    await Promise.all([
      triggerBreadcrumbs(OrderedSet()),
      triggerQueryParams({}),
      triggerRouteParams({}),
    ]);
    spec.detectChanges();
    expect(getBreadcrumbs()).toHaveLength(0);
  });

  describe("breadcrumb", () => {
    let crumb: Breadcrumb;
    let element: HTMLLIElement;

    beforeEach(async () => {
      crumb = generateBreadcrumb();
      await Promise.all([
        triggerBreadcrumbs(OrderedSet([crumb])),
        triggerQueryParams({}),
        triggerRouteParams({}),
      ]);
      spec.detectChanges();
      element = getBreadcrumbs()[0] as HTMLLIElement;
    });

    it("should show single breadcrumb", () => {
      expect(getBreadcrumbs()).toHaveLength(1);
    });

    it("should show label", () => {
      expect(element).toContainText(crumb.label);
    });

    it("should show icon", () => {
      assertIcon(element, crumb.icon);
    });
  });

  describe("link", () => {
    it("should have link", async () => {
      const crumb = generateBreadcrumb();
      await Promise.all([
        triggerBreadcrumbs(OrderedSet([crumb])),
        triggerQueryParams({}),
        triggerRouteParams({}),
      ]);
      spec.detectChanges();
      const element = getBreadcrumbs()[0].querySelector("a");
      assertStrongRouteLink(element, crumb.route.toRouterLink());
    });

    it("should pass query parameters to route", async () => {
      const crumb = {
        ...generateBreadcrumb(),
        route: StrongRoute.newRoot().addFeatureModule(
          modelData.random.word(),
          (params) => ({ projectId: params.projectId })
        ),
      };
      await Promise.all([
        triggerBreadcrumbs(OrderedSet([crumb])),
        triggerQueryParams({ projectId: 5 }),
        triggerRouteParams({}),
      ]);
      spec.detectChanges();
      const element = getBreadcrumbs()[0].querySelector("a");
      assertStrongRouteLink(
        element,
        crumb.route.toRouterLink() + "?projectId=5"
      );
    });

    it("should pass route parameters to route", async () => {
      const crumb = {
        ...generateBreadcrumb(),
        route: StrongRoute.newRoot().addFeatureModule(":projectId"),
      };
      await Promise.all([
        triggerBreadcrumbs(OrderedSet([crumb])),
        triggerQueryParams({}),
        triggerRouteParams({ projectId: 5 }),
      ]);
      spec.detectChanges();
      const element = getBreadcrumbs()[0].querySelector("a");
      assertStrongRouteLink(
        element,
        crumb.route.toRouterLink({ projectId: 5 })
      );
    });
  });

  it("should show multiple breadcrumbs", async () => {
    await Promise.all([
      triggerBreadcrumbs(
        OrderedSet([
          generateBreadcrumb(),
          generateBreadcrumb(),
          generateBreadcrumb(),
        ])
      ),
      triggerQueryParams({}),
      triggerRouteParams({}),
    ]);
    spec.detectChanges();
    expect(getBreadcrumbs()).toHaveLength(3);
  });

  it("should update whenever menu updates", async () => {
    await Promise.all([
      triggerBreadcrumbs(OrderedSet([generateBreadcrumb()])),
      triggerQueryParams({}),
      triggerRouteParams({}),
    ]);
    spec.detectChanges();
    expect(getBreadcrumbs()).toHaveLength(1);
    await triggerBreadcrumbs(
      OrderedSet([
        generateBreadcrumb(),
        generateBreadcrumb(),
        generateBreadcrumb(),
      ])
    );
    spec.detectChanges();
    expect(getBreadcrumbs()).toHaveLength(3);
  });
});
