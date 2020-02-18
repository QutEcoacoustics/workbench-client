import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { Site } from "src/app/models/Site";
import { testAppInitializer } from "src/app/test.helper";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService, Filters } from "./baw-api.service";
import {
  apiErrorDetails,
  apiErrorInfoDetails,
  shouldNotFail,
  shouldNotSucceed
} from "./baw-api.service.spec";
import { MockBawApiService } from "./mock/baseApiMock.service";
import { ShallowSitesService } from "./sites.service";

xdescribe("ShallowSitesService", () => {
  let service: ShallowSitesService;
  let httpMock: HttpTestingController;

  function createError(
    func:
      | "apiList"
      | "apiFilter"
      | "apiShow"
      | "apiCreate"
      | "apiUpdate"
      | "apiDestroy",
    url: string,
    error: ApiErrorDetails
  ) {
    spyOn<any>(service as any, func).and.callFake((path: string) => {
      expect(path).toBe(url);
      const subject = new Subject();

      setTimeout(() => {
        subject.error(error);
      }, 50);

      return subject;
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });

    service = TestBed.inject(ShallowSitesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("list", () => {
    function createSuccess(path: string, model: Site[]) {
      spyOn(service as any, "apiList").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next(model);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should handle empty response", fakeAsync(() => {
      const siteModels = [];

      createSuccess("/sites/", siteModels);

      service.list().subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single site", fakeAsync(() => {
      const siteModels = [
        new Site({
          id: 1,
          name: "name",
          creatorId: 2,
          projectIds: new Set([1, 2, 3])
        })
      ];

      createSuccess("/sites/", siteModels);

      service.list().subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple sites", fakeAsync(() => {
      const siteModels = [
        new Site({
          id: 1,
          name: "name",
          creatorId: 2,
          projectIds: new Set([1, 2, 3])
        }),
        new Site({
          id: 5,
          name: "name",
          creatorId: 10,
          projectIds: new Set([10, 20, 30])
        })
      ];

      createSuccess("/sites/", siteModels);

      service.list().subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiList", "/sites/", apiErrorDetails);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiList", "/sites/", apiErrorInfoDetails);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });

  describe("filter", () => {
    function createSuccess(path: string, filters: Filters, models: Site[]) {
      spyOn(service as any, "apiFilter").and.callFake(
        (_path: string, _filters: Filters) => {
          expect(_path).toBe(path);
          expect(_filters).toBe(filters);

          const subject = new Subject<Site[]>();

          setTimeout(() => {
            subject.next(models);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should handle empty filter response", fakeAsync(() => {
      const filters = {} as Filters;
      const siteModels = [];

      createSuccess("/sites/filter", filters, siteModels);

      service.filter(filters).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single site", fakeAsync(() => {
      const filters = {} as Filters;
      const siteModels = [
        new Site({
          id: 1,
          name: "name",
          creatorId: 2,
          projectIds: new Set([1, 2, 3])
        })
      ];

      createSuccess("/sites/filter", filters, siteModels);

      service.filter(filters).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple sites", fakeAsync(() => {
      const filters = {} as Filters;
      const siteModels = [
        new Site({
          id: 1,
          name: "name",
          creatorId: 2,
          projectIds: new Set([1, 2, 3])
        }),
        new Site({
          id: 5,
          name: "name",
          creatorId: 10,
          projectIds: new Set([10, 20, 30])
        })
      ];

      createSuccess("/sites/filter", filters, siteModels);

      service.filter(filters).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/sites/filter", apiErrorDetails);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/sites/filter", apiErrorInfoDetails);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorInfoDetails);
        });

      tick(100);
    }));

    // TODO Add tests for various types of filters
  });

  describe("show", () => {
    function createSuccess(url: string, output: Site) {
      spyOn(service as any, "apiShow").and.callFake((path: string) => {
        expect(path).toBe(url);

        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(output);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should handle site input", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/sites/1", siteModel);

      service.show(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle site id input", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/sites/1", siteModel);

      service.show(1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random site model id", fakeAsync(() => {
      const siteModel = new Site({
        id: 5,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/sites/5", siteModel);

      service.show(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random site id", fakeAsync(() => {
      const siteModel = new Site({
        id: 5,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/sites/5", siteModel);

      service.show(5).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiShow", "/sites/1", apiErrorDetails);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/sites/1", apiErrorInfoDetails);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });

  describe("create", () => {
    function createSuccess(path: string, model: Site) {
      spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _model: object) => {
          expect(_path).toBe(path);
          expect(_model).toEqual(model);

          const subject = new Subject<Site>();

          setTimeout(() => {
            subject.next(model);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should handle response", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createSuccess("/sites/", siteModel);

      service.create(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with name", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "Custom Name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createSuccess("/sites/", siteModel);

      service.create(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with description", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        description: "Custom Description",
        creatorId: 2,
        projectIds: new Set([])
      });

      createSuccess("/sites/", siteModel);

      service.create(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    // TODO Write tests for all input types

    it("should handle error", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createError("apiCreate", "/sites/", apiErrorDetails);

      service
        .create(siteModel)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createError("apiCreate", "/sites/", apiErrorInfoDetails);

      service
        .create(siteModel)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorInfoDetails);
        });

      tick(100);
    }));
  });

  describe("update", () => {
    function createSuccess(path: string, model: Site) {
      spyOn(service as any, "apiUpdate").and.callFake(
        (_path: string, _model: object) => {
          expect(_path).toBe(path);
          expect(_model).toEqual(model);

          const subject = new Subject<Site>();

          setTimeout(() => {
            subject.next(model);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should handle response", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createSuccess("/sites/1", siteModel);

      service.update(siteModel).subscribe(
        (site: Site) => {
          expect(site).toBeTruthy();
          expect(site).toEqual(siteModel);
        },
        () => {
          expect(true).toBeFalsy("Service should not return an error");
        }
      );

      tick(100);
    }));

    it("should handle response with random site id", fakeAsync(() => {
      const siteModel = new Site({
        id: 5
      });

      createSuccess("/sites/5", siteModel);

      service.update(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with name", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "Custom Name"
      });

      createSuccess("/sites/1", siteModel);

      service.update(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with description", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        description: "Custom Description"
      });

      createSuccess("/sites/1", siteModel);

      service.update(siteModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    // TODO Write tests for all input types

    it("should handle error", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createError("apiUpdate", "/sites/1", apiErrorDetails);

      service
        .update(siteModel)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorDetails);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createError("apiUpdate", "/sites/1", apiErrorInfoDetails);

      service
        .update(siteModel)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(apiErrorInfoDetails);
        });

      tick(100);
    }));
  });

  describe("destroy", () => {
    function createSuccess(path: string, model?: Site) {
      spyOn(service as any, "apiDestroy").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        const subject = new Subject<Site | void>();

        setTimeout(() => {
          if (model) {
            subject.next(model);
          } else {
            subject.next();
          }
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should handle site input", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1])
      });

      createSuccess("/sites/1");

      service.destroy(siteModel).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle site id input", fakeAsync(() => {
      createSuccess("/sites/1");

      service.destroy(1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random site id", fakeAsync(() => {
      createSuccess("/sites/5");

      service.destroy(5).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle non-void response", fakeAsync(() => {
      const model = new Site({
        id: 1,
        name: "name"
      });
      createSuccess("/sites/1", model);

      service.destroy(model).subscribe(_model => {
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/sites/1", apiErrorDetails);

      service.destroy(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorDetails);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiDestroy", "/sites/1", apiErrorInfoDetails);

      service.destroy(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(apiErrorInfoDetails);
      });

      tick(100);
    }));
  });
});
