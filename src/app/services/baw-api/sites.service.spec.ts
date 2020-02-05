import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { SitesService } from "./sites.service";

describe("SitesService", () => {
  let service: SitesService;
  let httpMock: HttpTestingController;

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

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /**
   * list
   */

  it("list should handle empty response", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.list(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("list should handle random project id", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/5/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.list(5).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("list should handle single site", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.list(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("list should handle multiple sites", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            }),
            new Site({
              id: 5,
              name: "Name",
              creatorId: 10,
              projectIds: new Set([10, 20, 30])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.list(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          }),
          new Site({
            id: 5,
            name: "Name",
            creatorId: 10,
            projectIds: new Set([10, 20, 30])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  // it("list should handle single site with empty filter", fakeAsync(() => {
  //   spyOn<any>(service, "list").and.callFake(
  //     (path: string, filters: Filters) => {
  //       expect(path).toBe("/projects/1/sites");
  //       expect(filters).toEqual({});
  //       const subject = new Subject<Site[]>();

  //       setTimeout(() => {
  //         subject.next([
  //           new Site({
  //             id: 1,
  //             name: "Name",
  //             creatorId: 2,
  //             projectIds: new Set([1, 2, 3])
  //           })
  //         ]);
  //         subject.complete();
  //       }, 50);

  //       return subject;
  //     }
  //   );

  //   service.list(1, {}).subscribe(
  //     (sites: Site[]) => {
  //       expect(sites).toBeTruthy();
  //       expect(sites).toEqual([
  //         new Site({
  //           id: 1,
  //           name: "Name",
  //           creatorId: 2,
  //           projectIds: new Set([1, 2, 3])
  //         })
  //       ]);
  //     },
  //     () => {
  //       expect(true).toBeFalsy("Service should not return an error");
  //     }
  //   );

  //   tick(100);
  // }));

  // it("list should handle single site with filter", fakeAsync(() => {
  //   spyOn<any>(service, "list").and.callFake(
  //     (path: string, filters: Filters) => {
  //       expect(path).toBe("/projects/1/sites");
  //       expect(filters).toEqual({ paging: { items: 3 } });
  //       const subject = new Subject<Site[]>();

  //       setTimeout(() => {
  //         subject.next([
  //           new Site({
  //             id: 1,
  //             name: "Name",
  //             creatorId: 2,
  //             projectIds: new Set([1, 2, 3])
  //           })
  //         ]);
  //         subject.complete();
  //       }, 50);

  //       return subject;
  //     }
  //   );

  //   service.list(1, { paging: { items: 3 } }).subscribe(
  //     (sites: Site[]) => {
  //       expect(sites).toBeTruthy();
  //       expect(sites).toEqual([
  //         new Site({
  //           id: 1,
  //           name: "Name",
  //           creatorId: 2,
  //           projectIds: new Set([1, 2, 3])
  //         })
  //       ]);
  //     },
  //     () => {
  //       expect(true).toBeFalsy("Service should not return an error");
  //     }
  //   );

  //   tick(100);
  // }));

  it("list should handle error", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.list(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("list should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
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
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.list(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * show
   */

  it("show should handle response", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.show(1, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("show should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/5/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.show(5, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("show should handle response with random site id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/5");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.show(1, 5).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  // it("show should handle response with empty filter", fakeAsync(() => {
  //   spyOn<any>(service, "show").and.callFake(
  //     (path: string, filters: Filters) => {
  //       expect(path).toBe("/projects/1/sites/1");
  //       expect(filters).toEqual({});
  //       const subject = new Subject<Site>();

  //       setTimeout(() => {
  //         subject.next(
  //           new Site({
  //             id: 1,
  //             name: "Name",
  //             creatorId: 2,
  //             projectIds: new Set([1, 2, 3])
  //           })
  //         );
  //         subject.complete();
  //       }, 50);

  //       return subject;
  //     }
  //   );

  //   service.show(1, 1, {}).subscribe(
  //     (site: Site) => {
  //       expect(site).toBeTruthy();
  //       expect(site).toEqual(
  //         new Site({
  //           id: 1,
  //           name: "Name",
  //           creatorId: 2,
  //           projectIds: new Set([1, 2, 3])
  //         })
  //       );
  //     },
  //     () => {
  //       expect(true).toBeFalsy("Service should not return an error");
  //     }
  //   );

  //   tick(100);
  // }));

  // it("show should handle response with filter", fakeAsync(() => {
  //   spyOn<any>(service, "show").and.callFake(
  //     (path: string, filters: Filters) => {
  //       expect(path).toBe("/projects/1/sites/1");
  //       expect(filters).toEqual({ paging: { items: 3 } });
  //       const subject = new Subject<Site>();

  //       setTimeout(() => {
  //         subject.next(
  //           new Site({
  //             id: 1,
  //             name: "Name",
  //             creatorId: 2,
  //             projectIds: new Set([1, 2, 3])
  //           })
  //         );
  //         subject.complete();
  //       }, 50);

  //       return subject;
  //     }
  //   );

  //   service.show(1, 1, { paging: { items: 3 } }).subscribe(
  //     (site: Site) => {
  //       expect(site).toBeTruthy();
  //       expect(site).toEqual(
  //         new Site({
  //           id: 1,
  //           name: "Name",
  //           creatorId: 2,
  //           projectIds: new Set([1, 2, 3])
  //         })
  //       );
  //     },
  //     () => {
  //       expect(true).toBeFalsy("Service should not return an error");
  //     }
  //   );

  //   tick(100);
  // }));

  it("show should handle error", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();

        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.show(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("show should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();

        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
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
          } as ApiErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.show(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * create
   */

  it("create should handle response", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.create({ name: "Name" }, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("create should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/5/sites");
      expect(values).toEqual({ name: "Name" });
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.create({ name: "Name" }, 5).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("create should handle response with description", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name", description: "Description" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.create({ name: "Name", description: "Description" }, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  xit("create should handle response with image", fakeAsync(() => {}));
  xit("create should handle response with location obfuscated", fakeAsync(() => {}));
  xit("create should handle response with custom location", fakeAsync(() => {}));
  xit("create should handle response with timezone information", fakeAsync(() => {}));
  xit("create should handle response with all inputs", fakeAsync(() => {}));

  it("create should handle error", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.create({ name: "Name" }, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("create should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
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
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.create({ name: "Name" }, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * update
   */

  it("update should handle response", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "site",
      description: "description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual(siteModel as object);

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(siteModel);
        subject.complete();
      }, 50);

      return subject;
    });

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

  it("update should handle response with random project id", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "site",
      description: "description",
      creatorId: 2,
      projectIds: new Set([5])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/5/sites/1");
      expect(values).toEqual(siteModel as object);
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(siteModel);
        subject.complete();
      }, 50);

      return subject;
    });

    service.update(siteModel, 5).subscribe(
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

  it("update should handle response with random site id", fakeAsync(() => {
    const siteModel = new Site({
      id: 5,
      name: "site",
      description: "description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/5");
      expect(values).toEqual(siteModel as object);
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(siteModel);
        subject.complete();
      }, 50);

      return subject;
    });

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

  it("update should handle response with name", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "Custom Name",
      description: "description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual(siteModel as object);

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(siteModel);
        subject.complete();
      }, 50);

      return subject;
    });

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

  it("update should handle response with description", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "site",
      description: "Custom Description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual(siteModel as object);

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(siteModel);
        subject.complete();
      }, 50);

      return subject;
    });

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

  xit("updateProjectSite should handle response with image", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with location obfuscated", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with custom location", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with timezone information", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with all inputs", fakeAsync(() => {}));

  it("update should handle error", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "site",
      description: "description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual(siteModel as object);

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.update(siteModel, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("update should handle error with info", fakeAsync(() => {
    const siteModel = new Site({
      id: 1,
      name: "site",
      description: "description",
      creatorId: 2,
      projectIds: new Set([1])
    });

    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual(siteModel as object);

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
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
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.update(siteModel, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * destroy
   */

  it("destroy should handle response", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.destroy(1, 1).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("destroy should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/5/sites/1");
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.destroy(1, 5).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("destroy should handle response with random site id", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/5");
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.destroy(5, 1).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("destroy should handle error", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.destroy(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));

  it("destroy should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
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
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    service.destroy(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as ApiErrorDetails);
      }
    );

    tick(100);
  }));
});
