import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Title } from "@angular/platform-browser";
import { environment, values } from "../../../assets/config/development.json";
import { AppConfigService } from "./app-config.service";

describe("AppConfigService", () => {
  const remoteEnvironment = {
    environment,
    values
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppConfigService]
    });
  });

  it("should be created", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });

  it("should load app config data", done => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    service.loadAppConfig().then(() => {
      expect(true).toEqual(true);
      done();
    });
  });

  it("should update website title", done => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const titleService: Title = TestBed.get(Title);
    service.loadAppConfig().then(() => {
      expect(titleService.getTitle()).toBe("<< brandName >>");
      done();
    });
  });

  it("should return config data", done => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    service.loadAppConfig().then(() => {
      expect(service.getConfig()).toEqual(remoteEnvironment);
      done();
    });
  });

  it("should get content url start of array", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const content = [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          },
          {
            title: "<< content5 >>",
            url: "<< contentUrl5 >>"
          }
        ]
      },
      {
        title: "<< content6 >>",
        url: "<< contentUrl6 >>"
      }
    ];

    expect(service.getContentUrl(content, ["<< content1 >>"])).toBe(
      "<< contentUrl1 >>"
    );
  });

  it("should get content url end of array", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const content = [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          },
          {
            title: "<< content5 >>",
            url: "<< contentUrl5 >>"
          }
        ]
      },
      {
        title: "<< content6 >>",
        url: "<< contentUrl6 >>"
      }
    ];

    expect(service.getContentUrl(content, ["<< content6 >>"])).toBe(
      "<< contentUrl6 >>"
    );
  });

  it("should get content url for dropdown title", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const content = [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          },
          {
            title: "<< content5 >>",
            url: "<< contentUrl5 >>"
          }
        ]
      },
      {
        headerTitle: "<< content6 >>",
        items: [
          {
            title: "<< content7 >>",
            url: "<< contentUrl7 >>"
          },
          {
            title: "<< content8 >>",
            url: "<< contentUrl8 >>"
          },
          {
            title: "<< content9 >>",
            url: "<< contentUrl9 >>"
          }
        ]
      },
      {
        title: "<< content10 >>",
        url: "<< contentUrl10 >>"
      }
    ];

    expect(
      service.getContentUrl(content, ["<< content6 >>", "<< content8 >>"])
    ).toBe("<< contentUrl8 >>");
  });

  it("should return # url for missing title", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const content = [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          },
          {
            title: "<< content5 >>",
            url: "<< contentUrl5 >>"
          }
        ]
      },
      {
        title: "<< content6 >>",
        url: "<< contentUrl6 >>"
      }
    ];

    expect(service.getContentUrl(content, ["missing"])).toBe("#");
  });

  it("should return # url for missing dropdown title", () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    const content = [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          },
          {
            title: "<< content5 >>",
            url: "<< contentUrl5 >>"
          }
        ]
      },
      {
        title: "<< content6 >>",
        url: "<< contentUrl6 >>"
      }
    ];

    expect(service.getContentUrl(content, ["<< content2 >>", "missing"])).toBe(
      "#"
    );
  });

  // TODO Modify environmentUrl variable in app-config to allow unit tests to change
  // the environment and config
});
