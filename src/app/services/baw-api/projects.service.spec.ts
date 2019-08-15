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

  const pageNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested page.",
        info: {
          original_route: "dsfaggsdfg",
          original_http_method: "GET"
        }
      }
    },
    data: null
  };

  const itemNotFoundResponse = {
    meta: {
      status: 404,
      message: "Not Found",
      error: {
        details: "Could not find the requested item.",
        info: null
      }
    },
    data: null
  };

  const projectValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
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
    data: {
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creator_id: 138,
      site_ids: [513, 514, 519],
      description_html: "<p>512 Description.</p>\n"
    }
  };

  const projectValidConvertedResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        orderBy: "creatorId",
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
    data: {
      id: 512,
      name: "512 Name",
      description: "512 Description.",
      creatorId: 138,
      siteIds: [513, 514, 519],
      descriptionHtml: "<p>512 Description.</p>\n"
    }
  };

  const projectUnauthorizedResponse = {
    meta: {
      status: 401,
      message: "Unauthorized",
      error: {
        details: "You need to log in or register before continuing.",
        links: {
          "Log in": "/my_account/sign_in",
          Register: "/my_account/sign_up",
          "Confirm account": "/my_account/confirmation/new"
        },
        info: null
      }
    },
    data: null
  };

  const projectsValidResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        order_by: "creator_id",
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
      },
      {
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creator_id: 138,
        site_ids: [513, 514, 519],
        description_html: "<p>513 Description.</p>\n"
      }
    ]
  };

  const projectsValidConvertedResponse = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        orderBy: "creatorId",
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
      },
      {
        id: 513,
        name: "513 Name",
        description: "513 Description.",
        creatorId: 138,
        siteIds: [513, 514, 519],
        descriptionHtml: "<p>513 Description.</p>\n"
      }
    ]
  };

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

  it("getProjects should return data", () => {
    service.getProjects().subscribe(res => {
      expect(res).toEqual(projectsValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects");
    expect(req.request.method).toBe("GET");
    req.flush(projectsValidResponse);
  });

  it("getProject should return data", () => {
    service.getProject(512).subscribe(res => {
      expect(res).toEqual(projectValidConvertedResponse);
    });

    const req = httpMock.expectOne(url + "/projects/512");
    expect(req.request.method).toBe("GET");
    req.flush(projectValidResponse);
  });

  it("getProject invalid project should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    req.flush(itemNotFoundResponse);
  });

  it("getProject invalid page should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    req.flush(pageNotFoundResponse);
  });

  it("getProject unauthorized should return error", () => {
    service.getProject(-1).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/-1");
    expect(req.request.method).toBe("GET");
    req.flush(projectUnauthorizedResponse);
  });

  it("getFilteredProjects should get filtered number of items", () => {
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
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get ordered by creator id", () => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
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
          orderBy: "creatorId",
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
        orderBy: "creatorId"
      })
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(
      url + "/projects/filter?order_by=creator_id"
    );
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get descending order direction", () => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "id",
          direction: "desc"
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
          orderBy: "id",
          direction: "desc"
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
        direction: "desc"
      })
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(url + "/projects/filter?direction=desc");
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });

  it("getFilteredProjects should get multi filter", () => {
    const dummyApiResponse = {
      meta: {
        status: 200,
        message: "OK",
        sorting: {
          order_by: "creator_id",
          direction: "desc"
        },
        paging: {
          page: 2,
          items: 5,
          total: 1,
          max_page: 2,
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
          orderBy: "creatorId",
          direction: "desc"
        },
        paging: {
          page: 2,
          items: 5,
          total: 1,
          maxPage: 2,
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
        direction: "desc",
        items: 3,
        orderBy: "creatorId",
        page: 2
      })
      .subscribe(res => {
        expect(res).toEqual(dummyApiConvertedResponse);
      });

    const req = httpMock.expectOne(
      url + "/projects/filter?direction=desc&items=3&order_by=creator_id&page=2"
    );
    expect(req.request.method).toBe("GET");
    req.flush(dummyApiResponse);
  });

  it("getProject empty response should return error msg", () => {
    service.getProject(512).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects/512");
    expect(req.request.method).toBe("GET");
    req.flush({ meta: { status: 404 } });
  });

  it("getProjects empty response should return error msg", () => {
    service.getProjects().subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/projects");
    expect(req.request.method).toBe("GET");
    req.flush({ meta: { status: 404 } });
  });

  it("getFilteredProjects empty response should return error msg", () => {
    service
      .getFilteredProjects({
        items: 3
      })
      .subscribe(
        res => {
          expect(res).toBeFalsy();
        },
        err => {
          expect(err).toBeTruthy();
          expect(typeof err).toBe("string");
        }
      );

    const req = httpMock.expectOne(url + "/projects/filter?items=3");
    expect(req.request.method).toBe("GET");
    req.flush({ meta: { status: 404 } });
  });
});
