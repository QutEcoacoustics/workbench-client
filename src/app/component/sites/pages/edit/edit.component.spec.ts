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
import { testBawServices, validationMessages } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Site } from "src/app/models/Site";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { EditComponent } from "./edit.component";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";

describe("SitesEditComponent", () => {
  let api: SitesService;
  let router: ActivatedRoute;
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1, siteId: 1 });
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [EditComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    api = TestBed.get(SitesService);
    router = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.schema.model = {};

    spyOn(api, "getProjectSite").and.callFake(() => {
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
    ).toBe(6);
  });

  /* Site Name Input */

  it("should contain site name as first input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("site name field should have 'name' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.id).toContain("_name_");
  });

  it("site name field should be text input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.type).toBe("text");
  });

  it("site name field should be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.required).toBeTruthy();
  });

  it("site name field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Site Name");
  });

  /* Site Description Textarea */

  it("should contain site description as second input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input).toBeTruthy();
  });

  it("site description field should have 'description' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input.id).toContain("_description_");
  });

  it("site description field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input.required).toBeFalsy();
  });

  it("site description field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Description");
  });

  /* Site Latitude Input */

  it("should contain site latitude as third input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("site latitude field should have 'customLatitude' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.id).toContain("_customLatitude_");
  });

  it("site latitude field should be number input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.type).toBe("number");
  });

  it("site latitude field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.required).toBeFalsy();
  });

  it("site latitude field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Latitude");
  });

  /* Site Longitude Input */

  it("should contain site longitude as fourth input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("site longitude field should have 'customLongitude' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("input");

    expect(input.id).toContain("_customLongitude_");
  });

  it("site longitude field should be number input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("input");

    expect(input.type).toBe("number");
  });

  it("site longitude field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("input");

    expect(input.required).toBeFalsy();
  });

  it("site longitude field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[3]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Longitude");
  });

  /* Site Image Input */

  it("should contain site image as fifth input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("site image field should have 'image' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("input");

    expect(input.id).toContain("_image_");
  });

  it("site image field should be number input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("input");

    expect(input.type).toBe("file");
  });

  it("site image field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("input");

    expect(input.required).toBeFalsy();
  });

  it("site image field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[4]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Image");
  });

  /* Site Timezone Input */

  it("should contain site timezone as sixth input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("site timezone field should have 'timezoneInformation' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("input");

    expect(input.id).toContain("_timezoneInformation_");
  });

  it("site timezone field should be text input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("input");

    expect(input.type).toBe("text");
  });

  it("site timezone field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("input");

    expect(input.required).toBeFalsy();
  });

  it("site timezone field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[5]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Time Zone");
  });

  /* End of input typing checks */

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

  it("should update site on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite");

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
    expect(api.updateProjectSite).toHaveBeenCalled();
    expect(api.updateProjectSite).toHaveBeenCalledWith(1, 1, {
      name: "test site"
    });
  }));

  it("should update site containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite");

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
    expect(api.updateProjectSite).toHaveBeenCalled();
    expect(api.updateProjectSite).toHaveBeenCalledWith(1, 1, {
      name: "test site 😀"
    });
  }));

  it("should update site on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite");

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
    expect(api.updateProjectSite).toHaveBeenCalled();
    expect(api.updateProjectSite).toHaveBeenCalledWith(1, 1, {
      name: "test site",
      description: "test description"
    });
  }));

  xit("should not update site on submit with latitude and no longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite");

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
    spyOn(api, "updateProjectSite");

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

  xit("should update site on submit with latitude and longitude", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite");

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
    expect(api.updateProjectSite).toHaveBeenCalled();
    expect(api.updateProjectSite).toHaveBeenCalledWith(1, 1, {
      name: "test site"
    });
  }));

  xit("should update site on submit with image", fakeAsync(() => {}));
  xit("should update site on submit with all inputs", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite").and.callFake(() => {
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
    name.value = "test project";
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
    expect(msg.innerText).toContain("Site was successfully updated.");
  }));

  it("should show error on unauthorized", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project";
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

  it("should show error on project not found", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({ status: 404, message: "Not Found" } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project";
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
    spyOn(api, "updateProjectSite").and.callFake(() => {
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
    spyOn(api, "updateProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
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
    spyOn(api, "updateProjectSite").and.callFake(() => {
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
    spyOn(api, "updateProjectSite").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    button.click();

    tick(100);
    fixture.detectChanges();

    expect(button).toBeTruthy();
    expect(button.disabled).toBeFalsy("Button should not be disabled");
  }));
});
