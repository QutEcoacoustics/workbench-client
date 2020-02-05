import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { SitesService } from "./sites.service";

describe("SitesService", () => {
  let service: SitesService;
  let httpMock: HttpTestingController;

  const errorResponse = {
    status: 401,
    message: "Unauthorized"
  } as ApiErrorDetails;

  const errorInfoResponse = {
    status: 422,
    message: "Record could not be saved",
    info: {
      name: ["has already been taken"],
      image: [],
      image_file_name: [],
      image_file_size: [],
      image_content_type: [],
      image_updated_at: []
    }
  } as ApiErrorDetails;

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
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.error(error);
      }, 50);

      return subject;
    });
  }

  const shouldNotSucceed = () => {
    fail("Service should not produce a data output");
  };

  const shouldNotFail = () => {
    fail("Service should not produce an error");
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });

    service = TestBed.get(SitesService);
    httpMock = TestBed.get(HttpTestingController);
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

    it("should handle project input", fakeAsync(() => {
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });
      const siteModels = [];

      createSuccess("/projects/1/sites/", siteModels);

      service.list(projectModel).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle empty response", fakeAsync(() => {
      const siteModels = [];

      createSuccess("/projects/1/sites/", siteModels);

      service.list(1).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle random project id", fakeAsync(() => {
      const siteModels = [];

      createSuccess("/projects/5/sites/", siteModels);

      service.list(5).subscribe((sites: Site[]) => {
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

      createSuccess("/projects/1/sites/", siteModels);

      service.list(1).subscribe((sites: Site[]) => {
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

      createSuccess("/projects/1/sites/", siteModels);

      service.list(1).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiList", "/projects/1/sites/", errorResponse);

      service.list(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiList", "/projects/1/sites/", errorInfoResponse);

      service.list(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
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

    it("should handle project input", fakeAsync(() => {
      const filters = {} as Filters;
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });
      const siteModels = [];

      createSuccess("/projects/1/sites/filter", filters, siteModels);

      service.filter(filters, projectModel).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle empty filter response", fakeAsync(() => {
      const filters = {} as Filters;
      const siteModels = [];

      createSuccess("/projects/1/sites/filter", filters, siteModels);

      service.filter(filters, 1).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle random project id", fakeAsync(() => {
      const filters = {} as Filters;
      const siteModels = [];

      createSuccess("/projects/5/sites/filter", filters, siteModels);

      service.filter(filters, 5).subscribe((sites: Site[]) => {
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

      createSuccess("/projects/1/sites/filter", filters, siteModels);

      service.filter(filters, 1).subscribe((sites: Site[]) => {
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

      createSuccess("/projects/1/sites/filter", filters, siteModels);

      service.filter(filters, 1).subscribe((sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual(siteModels);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/projects/1/sites/filter", errorResponse);

      service
        .filter(filters, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/projects/1/sites/filter", errorInfoResponse);

      service
        .filter(filters, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
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

      createSuccess("/projects/1/sites/1", siteModel);

      service.show(siteModel, 1).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/1", siteModel);

      service.show(1, 1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project input", fakeAsync(() => {
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/projects/1/sites/1", siteModel);

      service.show(1, projectModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([1, 2, 3])
      });

      createSuccess("/projects/5/sites/1", siteModel);

      service.show(siteModel, 5).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/5", siteModel);

      service.show(siteModel, 1).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/5", siteModel);

      service.show(5, 1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiShow", "/projects/1/sites/1", errorResponse);

      service.show(1, 1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/projects/1/sites/1", errorInfoResponse);

      service.show(1, 1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
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

      createSuccess("/projects/1/sites/", siteModel);

      service.create(siteModel, 1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project input", fakeAsync(() => {
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createSuccess("/projects/1/sites/", siteModel);

      service.create(siteModel, projectModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createSuccess("/projects/5/sites/", siteModel);

      service.create(siteModel, 5).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/", siteModel);

      service.create(siteModel, 1).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/", siteModel);

      service.create(siteModel, 1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    xit("should handle response with image", fakeAsync(() => {}));
    xit("should handle response with location obfuscated", fakeAsync(() => {}));
    xit("should handle response with custom location", fakeAsync(() => {}));
    xit("should handle response with timezone information", fakeAsync(() => {}));
    xit("should handle response with all inputs", fakeAsync(() => {}));

    it("should handle error", fakeAsync(() => {
      const siteModel = new Site({
        id: 1,
        name: "name",
        creatorId: 2,
        projectIds: new Set([])
      });

      createError("apiCreate", "/projects/1/sites/", errorResponse);

      service
        .create(siteModel, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
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

      createError("apiCreate", "/projects/1/sites/", errorInfoResponse);

      service
        .create(siteModel, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
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

      createSuccess("/projects/1/sites/1", siteModel);

      service.update(siteModel, 1).subscribe(
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

    it("should handle project input", fakeAsync(() => {
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });
      const siteModel = new Site({
        id: 1
      });

      createSuccess("/projects/1/sites/1", siteModel);

      service.update(siteModel, projectModel).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createSuccess("/projects/5/sites/1", siteModel);

      service.update(siteModel, 5).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random site id", fakeAsync(() => {
      const siteModel = new Site({
        id: 5
      });

      createSuccess("/projects/1/sites/5", siteModel);

      service.update(siteModel, 1).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/1", siteModel);

      service.update(siteModel, 1).subscribe((site: Site) => {
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

      createSuccess("/projects/1/sites/1", siteModel);

      service.update(siteModel, 1).subscribe((site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(siteModel);
      }, shouldNotFail);

      tick(100);
    }));

    xit("should handle response with image", fakeAsync(() => {}));
    xit("should handle response with location obfuscated", fakeAsync(() => {}));
    xit("should handle response with custom location", fakeAsync(() => {}));
    xit("should handle response with timezone information", fakeAsync(() => {}));
    xit("should handle response with all inputs", fakeAsync(() => {}));

    it("should handle error", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createError("apiUpdate", "/projects/1/sites/1", errorResponse);

      service
        .update(siteModel, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const siteModel = new Site({
        id: 1
      });

      createError("apiUpdate", "/projects/1/sites/1", errorInfoResponse);

      service
        .update(siteModel, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
        });

      tick(100);
    }));
  });

  describe("destroy", () => {
    function createSuccess(path: string) {
      spyOn(service as any, "apiDestroy").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        const subject = new Subject<void>();

        setTimeout(() => {
          subject.next();
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

      createSuccess("/projects/1/sites/1");

      service.destroy(siteModel, 1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle site id input", fakeAsync(() => {
      createSuccess("/projects/1/sites/1");

      service.destroy(1, 1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project input", fakeAsync(() => {
      const projectModel = new Project({
        id: 1,
        name: "name",
        creatorId: 2,
        siteIds: new Set([1])
      });

      createSuccess("/projects/1/sites/1");

      service.destroy(1, projectModel).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project id input", fakeAsync(() => {
      createSuccess("/projects/1/sites/1");

      service.destroy(1, 1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      createSuccess("/projects/5/sites/1");

      service.destroy(1, 5).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random site id", fakeAsync(() => {
      createSuccess("/projects/1/sites/5");

      service.destroy(5, 1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/projects/1/sites/1", errorResponse);

      service
        .destroy(1, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiDestroy", "/projects/1/sites/1", errorInfoResponse);

      service
        .destroy(1, 1)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
        });

      tick(100);
    }));
  });
});
