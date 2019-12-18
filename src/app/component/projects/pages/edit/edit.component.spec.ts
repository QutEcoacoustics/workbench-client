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
import { Project } from "src/app/models/Project";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: ProjectsService;
  let router: ActivatedRoute;
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1 });
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
    api = TestBed.get(ProjectsService);
    router = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    component.schema.model = {};

    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Project",
            description: "Project Description",
            creatorId: 1,
            siteIds: new Set([])
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

  it("should contain three inputs", () => {
    expect(
      fixture.nativeElement.querySelectorAll("form formly-field").length
    ).toBe(3);
  });

  it("should contain project name as first input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("project name field should have 'name' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.id).toContain("_name_");
  });

  it("project name field should be text input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.type).toBe("text");
  });

  it("project name field should be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("input");

    expect(input.required).toBeTruthy();
  });

  it("project name field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[0]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Project Name");
  });

  it("should contain project description as second input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input).toBeTruthy();
  });

  it("project description field should have 'description' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input.id).toContain("_description_");
  });

  it("project description field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("textarea");

    expect(input.required).toBeFalsy();
  });

  it("project description field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[1]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Description");
  });

  it("should contain project image as third input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input).toBeTruthy();
  });

  it("project image field should have 'image' id", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.id).toContain("_image_");
  });

  it("project image field should be file input", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.type).toBe("file");
  });

  it("project image field should not be required", () => {
    const input = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("input");

    expect(input.required).toBeFalsy();
  });

  it("project image field should have label", () => {
    const label = fixture.nativeElement
      .querySelectorAll("form formly-field")[2]
      .querySelector("label");

    expect(label).toBeTruthy();
    expect(label.innerText).toContain("Image");
  });

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

  it("should update project on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject");

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
    expect(api.updateProject).toHaveBeenCalled();
    expect(api.updateProject).toHaveBeenCalledWith(1, {
      name: "test project"
    });
  }));

  it("should update project containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject");

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
    expect(api.updateProject).toHaveBeenCalled();
    expect(api.updateProject).toHaveBeenCalledWith(1, {
      name: "test project 😀"
    });
  }));

  it("should update project on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject");

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
    expect(api.updateProject).toHaveBeenCalled();
    expect(api.updateProject).toHaveBeenCalledWith(1, {
      name: "test project",
      description: "test description"
    });
  }));

  xit("should update project on submit with image", fakeAsync(() => {}));
  xit("should update project on submit with image and description", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject").and.callFake(() => {
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
    expect(msg.innerText).toContain("Project was successfully updated.");
  }));

  it("should show error on duplicate project name", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject").and.callFake(() => {
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

  it("should show error on duplicate project name", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject").and.callFake(() => {
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

  it("should disable submit button during submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject").and.callFake(() => {
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

  it("should re-enable submit button after submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "updateProject").and.callFake(() => {
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
