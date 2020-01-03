import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { Subject } from "rxjs";
import { formlyRoot, testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { NewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  let api: ProjectsService;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, FormlyModule.forRoot(formlyRoot)],
      declarations: [NewComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    api = TestBed.get(ProjectsService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.schema.model = {};
  });

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

  it("should contain three inputs", () => {
    expect(
      fixture.nativeElement.querySelectorAll("form formly-field").length
    ).toBe(3);
  });

  /* Project Name Input */

  it("should contain project name input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain input as first field");
    expect(input.id).toContain(
      "_name_",
      "Project name input id should be 'name'"
    );
    expect(input.type).toBe(
      "text",
      "Project name input should be of type 'text'"
    );
    expect(input.required).toBeTruthy("Project name input should be required");

    expect(label).toBeTruthy("Project name input should have label");
    expect(label.innerText).toContain(
      "Project Name",
      "Project name label should be 'Project Name'"
    );
  });

  /* Project Description Textarea */

  it("should contain project description textarea", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("label");

    expect(input).toBeTruthy("Form should contain textarea as second field");
    expect(input.id).toContain(
      "_description_",
      "Project description field id should be 'description'"
    );
    expect(input.required).toBeFalsy(
      "Project description field should not be required"
    );

    expect(label).toBeTruthy("Project name input should have label");
    expect(label.innerText).toContain(
      "Description",
      "Project description label should be 'Description'"
    );
  });

  /* Project Image Input */

  it("should contain site image input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("formly-image-input input");
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("label");

    expect(input).toBeTruthy(
      "Form should contain custom image input as third field"
    );
    expect(input.id).toContain("_image_", "Image input id should be 'image'");
    expect(input.type).toBe("file", "Image input should be of type 'file'");
    expect(input.required).toBeFalsy("Image input should not be required");

    expect(label).toBeTruthy("Image input should have label");
    expect(label.innerText).toContain("Image", "Image label should be 'Image'");
  });

  /* End of input typing checks */

  it("should not call submit function with missing project name", fakeAsync(() => {
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

  it("should show error message with missing project name", fakeAsync(() => {
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

  it("should create new project on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.newProject).toHaveBeenCalled();
    expect(api.newProject).toHaveBeenCalledWith({
      name: "test project"
    });
  }));

  it("should create new project containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project 😀";
    name.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector(
      "button[type='submit']"
    );
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.newProject).toHaveBeenCalled();
    expect(api.newProject).toHaveBeenCalledWith({
      name: "test project 😀"
    });
  }));

  it("should create new project on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject");

    const name = fixture.debugElement.nativeElement.querySelectorAll(
      "input"
    )[0];
    name.value = "test project";
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
    expect(api.newProject).toHaveBeenCalled();
    expect(api.newProject).toHaveBeenCalledWith({
      name: "test project",
      description: "test description"
    });
  }));

  xit("should create new project on submit with image", fakeAsync(() => {}));
  xit("should create new project on submit with all inputs", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject").and.callFake(() => {
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
    expect(msg.innerText).toContain("Project was successfully created.");
  }));

  it("should show error on duplicate project name", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Record could not be saved",
          status: 422,
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
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
    expect(msg.innerText).toContain(
      "Record could not be saved: name has already been taken"
    );
  }));

  it("should show error on unauthorized", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: 401
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

  it("should disable submit button during successful submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "newProject").and.callFake(() => {
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
    spyOn(api, "newProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: 401
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
    spyOn(api, "newProject").and.callFake(() => {
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
    spyOn(api, "newProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          message: "Unauthorized",
          info: 401
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
