import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { mockSite, Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { testBawServices } from "src/app/test.helper";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let api: SitesService;
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1, siteId: 1 });
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, RouterTestingModule, SharedModule],
      declarations: [EditComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    api = TestBed.inject(SitesService);
    component = fixture.componentInstance;
    component.schema.model = { name: "", description: "" };

    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Project",
            description: "Project Description",
            creatorId: 1,
            projectIds: new Set([1])
          })
        );
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

  it("should show error message with missing site name", fakeAsync(() => {
    spyOn(component, "submit");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should update site on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Site({
        id: 1,
        name: "test site"
      }),
      1
    );
  }));

  it("should update site containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site 😀";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Site({
        id: 1,
        name: "test site 😀"
      }),
      1
    );
  }));

  it("should update site on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const description = fixture.nativeElement.querySelectorAll("textarea")[0];
    description.value = "test description";
    description.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Site({
        id: 1,
        name: "test site",
        description: "test description"
      }),
      1
    );
  }));

  xit("should not update site on submit with latitude and no longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const latitude = fixture.nativeElement.querySelectorAll("input")[2];
    latitude.value = 0;
    latitude.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).not.toHaveBeenCalled();
  }));

  xit("should show error message on submit with latitude and no longitude", fakeAsync(() => {}));

  xit("should not create new site on submit with longitude and no latitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const longitude = fixture.nativeElement.querySelectorAll("input")[3];
    longitude.value = 1;
    longitude.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).not.toHaveBeenCalled();
  }));

  xit("should show error message on submit with longitude and no latitude", fakeAsync(() => {}));

  xit("should update site on submit with latitude and longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test site";
    name.dispatchEvent(new Event("input"));

    const latitude = fixture.nativeElement.querySelectorAll("input")[2];
    latitude.value = 0;
    latitude.dispatchEvent(new Event("input"));

    const longitude = fixture.nativeElement.querySelectorAll("input")[3];
    longitude.value = 1;
    longitude.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Site({
        id: 1,
        name: "test site"
      }),
      1
    );
  }));

  xit("should update site on submit with image", fakeAsync(() => {}));
  xit("should update site on submit with all inputs", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(mockSite);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert.alert-success");
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Site was successfully updated.");
  }));

  it("should show error on unauthorized", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Unauthorized");
  }));

  it("should show error on project not found", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({ status: 404, message: "Not Found" } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain("Not Found");
  }));

  it("should disable submit button during successful submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(mockSite);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
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
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
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
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(mockSite);
        subject.complete();
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
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
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(100);
    fixture.detectChanges();

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy("Button should not be disabled");
  }));
});
