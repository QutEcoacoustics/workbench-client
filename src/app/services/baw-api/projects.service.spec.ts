import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;
  const url = "https://staging.ecosounds.org";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });
    service = TestBed.get(ProjectsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("get projects should return data", () => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 25,
          total: 1,
          max_page: 1,
          current:
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: [513, 514, 519],
          description_html: "<p>512 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          orderBy: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 25,
          total: 1,
          maxPage: 1,
          current:
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creatorId: 138,
          siteIds: [513, 514, 519],
          descriptionHtml: "<p>512 Description.</p>\n"
        }
      ]
    };

    service.getProjects().subscribe(res => {
      expect(res).toEqual(dummyApiConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects");
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });

  it("should get filtered list of projects", () => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 3,
          total: 1,
          max_page: 1,
          current:
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creator_id: 138,
          site_ids: [513, 514, 519],
          description_html: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creator_id: 138,
          site_ids: [513, 514, 519],
          description_html: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creator_id: 138,
          site_ids: [513, 514, 519],
          description_html: "<p>514 Description.</p>\n"
        }
      ]
    };

    const dummyApiConvertedResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          orderBy: "name",
          direction: "asc"
        },
        paging: {
          page: 1,
          items: 3,
          total: 1,
          maxPage: 1,
          current:
            "http://staging.ecosounds.org/projects?direction=asc&items=3&order_by=name&page=1",
          previous: null,
          next: null
        }
      },
      data: [
        {
          id: 512,
          name: "512 Name",
          description: "512 Description.",
          creatorId: 138,
          siteIds: [513, 514, 519],
          descriptionHtml: "<p>512 Description.</p>\n"
        },
        {
          id: 513,
          name: "513 Name",
          description: "513 Description.",
          creatorId: 138,
          siteIds: [513, 514, 519],
          descriptionHtml: "<p>513 Description.</p>\n"
        },
        {
          id: 514,
          name: "514 Name",
          description: "514 Description.",
          creatorId: 138,
          siteIds: [513, 514, 519],
          descriptionHtml: "<p>514 Description.</p>\n"
        }
      ]
    };

    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(res => {
        expect(res.meta.paging.items).toBe(3);
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });
});
