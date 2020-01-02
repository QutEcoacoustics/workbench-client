import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject, Subject } from "rxjs";
import { formlyRoot, testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { NewComponent } from "./new.component";

describe("SitesNewComponent", () => {
  let sitesApi: SitesService;
  let projectApi: ProjectsService;
  let router: ActivatedRoute;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1 });
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [NewComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  }));

  it("should handle project not found", fakeAsync(() => {
    fixture = TestBed.createComponent(NewComponent);
    sitesApi = TestBed.get(SitesService);
    projectApi = TestBed.get(ProjectsService);
    router = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.schema.model = {};

    spyOn(projectApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.error({
          message: "Not Found",
          status: projectApi.apiReturnCodes.notFound
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Not found");
  }));

  it("should handle project unauthorized", fakeAsync(() => {
    fixture = TestBed.createComponent(NewComponent);
    sitesApi = TestBed.get(SitesService);
    projectApi = TestBed.get(ProjectsService);
    router = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.schema.model = {};

    spyOn(projectApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          status: projectApi.apiReturnCodes.unauthorized
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unauthorized access");
  }));
});

describe("SitesNewComponent", () => {
  let sitesApi: SitesService;
  let projectApi: ProjectsService;
  let router: ActivatedRoute;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1 });
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [NewComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    sitesApi = TestBed.get(SitesService);
    projectApi = TestBed.get(ProjectsService);
    router = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.schema.model = {};

    spyOn(projectApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Project",
            description: "Project Description",
            creatorId: 1,
            siteIds: new Set([1])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", () => {
    expect(
      fixture.nativeElement.querySelector("button[type='submit']")
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector("button[type='submit']").disabled
    ).toBeFalsy();
  });

  it("should contain six inputs", () => {
    expect(
      fixture.nativeElement.querySelectorAll("form formly-field").length
    ).toBe(7); // FieldGroup adds a formly-field
  });

  /* Site Name Input */

  it("should contain site name input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain input as first field");
    expect(input.id).toContain("_name_", "Site name input id should be 'name'");
    expect(input.type).toBe("text", "Site name input should be of type 'text'");
    expect(input.required).toBeTruthy("Site name input should be required");

    expect(label).toBeTruthy("Site name input should have label");
    expect(label.innerText).toContain(
      "Site Name",
      "Site name label should be 'Site Name'"
    );
  });

  /* Site Description Textarea */

  it("should contain site description textarea", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain textarea as second field");
    expect(input.id).toContain(
      "_description_",
      "Site description field id should be 'description'"
    );
    expect(input.required).toBeFalsy(
      "Site description field should not be required"
    );

    expect(label).toBeTruthy("Site name input should have label");
    expect(label.innerText).toContain(
      "Description",
      "Site description label should be 'Description'"
    );
  });

  /* Site Latitude Input */

  it("should contain site latitude input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain input as third field");
    expect(input.id).toContain(
      "_customLatitude_",
      "Latitude input id should be 'customLatitude'"
    );
    expect(input.type).toBe(
      "number",
      "Latitude input should be of type 'number'"
    );
    expect(input.required).toBeFalsy("Latitude input should not be required");

    expect(label).toBeTruthy("Latitude input should have label");
    expect(label.innerText).toContain(
      "Latitude",
      "Latitude label should be 'Latitude'"
    );
  });

  /* Site Longitude Input */

  it("should contain site longitude input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain input as fourth field");
    expect(input.id).toContain(
      "_customLongitude_",
      "Longitude input id should be 'customLongitude'"
    );
    expect(input.type).toBe(
      "number",
      "Longitude input should be of type 'number'"
    );
    expect(input.required).toBeFalsy("Longitude input should not be required");

    expect(label).toBeTruthy("Longitude input should have label");
    expect(label.innerText).toContain(
      "Longitude",
      "Longitude label should be 'Longitude'"
    );
  });

  /* Site Image Input */

  it("should contain site image input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("formly-image-input input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("label");

    expect(input).toBeTruthy(
      "Form should contain custom image input as fifth field"
    );
    expect(input.id).toContain("_image_", "Image input id should be 'image'");
    expect(input.type).toBe("file", "Image input should be of type 'file'");
    expect(input.required).toBeFalsy("Image input should not be required");

    expect(label).toBeTruthy("Image input should have label");
    expect(label.innerText).toContain("Image", "Image label should be 'Image'");
  });

  /* Site Timezone Input */

  it("should contain site timezone input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[6]
      .querySelector("formly-timezone-input select");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[6]
      .querySelector("label");

    expect(input).toBeTruthy(
      "Form should contain custom timezone input as sixth field"
    );
    expect(input.id).toContain(
      "_timezoneInformation_",
      "Timezone input id should be 'timezoneInformation'"
    );
    expect(input.required).toBeFalsy("Timezone input should not be required");

    expect(label).toBeTruthy("Timezone input should have label");
    expect(label.innerText).toContain(
      "Time Zone",
      "Timezone label should be 'Time Zone'"
    );
  });

  /* End of input typing checks */

  it("should not call submit function with missing site name", fakeAsync(() => {
    spyOn(component, "submit");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing site name", fakeAsync(() => {
    spyOn(component, "submit");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should create new site on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalledWith(1, {
      name: "test site"
    });
  }));

  it("should create new site containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site 😀";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalledWith(1, {
      name: "test site 😀"
    });
  }));

  it("should create new site on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const description = fixture.debugElement.nativeElement.querySelectorAll(
      "textarea"
    )[0];
    description.value = "test description";
    description.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalledWith(1, {
      name: "test site",
      description: "test description"
    });
  }));

  xit("should not create new site on submit with latitude and no longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const latitude = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    latitude.value = 0;
    latitude.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).not.toHaveBeenCalled();
  }));

  xit("should show error message on submit with latitude and no longitude", fakeAsync(() => {}));

  xit("should not create new site on submit with longitude and no latitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const longitude = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    longitude.value = 1;
    longitude.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).not.toHaveBeenCalled();
  }));

  xit("should show error message on submit with longitude and no latitude", fakeAsync(() => {}));

  xit("should create new site on submit with latitude and longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const latitude = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[2];
    latitude.value = 0;
    latitude.dispatchEvent(new Event("input"));

    const longitude = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[3];
    longitude.value = 1;
    longitude.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalled();
    expect(sitesApi.newProjectSite).toHaveBeenCalledWith(1, {
      name: "test site"
    });
  }));

  xit("should create new site on submit with image", fakeAsync(() => {}));
  xit("should create new site on submit with all inputs", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-success"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Site was successfully created.");
  }));

  it("should show error on unauthorized", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: sitesApi.apiReturnCodes.unauthorized
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Unauthorized");
  }));

  it("should show error on site not found", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Not Found",
          info: sitesApi.apiReturnCodes.notFound
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.debugElement.nativeElement.querySelector(
      "ngb-alert.alert-danger"
    );
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Not Found");
  }));

  it("should disable submit button during successful submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(10);

    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy("Button should be disabled");

    tick(100);
    fixture.detectChanges();
  }));

  it("should disable submit button during error submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: sitesApi.apiReturnCodes.unauthorized
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(10);

    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy("Button should be disabled");

    tick(100);
    fixture.detectChanges();
  }));

  it("should re-enable submit button after successful submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(100);
    fixture.detectChanges();

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy("Button should not be disabled");
  }));

  it("should re-enable submit button after error submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(sitesApi, "newProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: sitesApi.apiReturnCodes.unauthorized
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(100);
    fixture.detectChanges();

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy("Button should not be disabled");
  }));
});
