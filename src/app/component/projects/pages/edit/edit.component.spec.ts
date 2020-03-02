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
import { mockProject, Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { testBawServices } from "src/app/test.helper";
import { EditComponent } from "./edit.component";

xdescribe("ProjectsEditComponent", () => {
  let api: ProjectsService;
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 1 });
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
    api = TestBed.inject(ProjectsService);
    component = fixture.componentInstance;
    component.schema.model = { name: "" };

    spyOn(api, "show").and.callFake(() => {
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

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing project name", fakeAsync(() => {
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

  it("should update project on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Project({
        id: 1,
        name: "test project"
      })
    );
  }));

  it("should update project containing emoji on submit", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project 😀";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    expect(component.submit).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalled();
    expect(api.update).toHaveBeenCalledWith(
      new Project({
        id: 1,
        name: "test project 😀"
      })
    );
  }));

  it("should update project on submit with description", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update");

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
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
      new Project({
        id: 1,
        name: "test project",
        description: "test description"
      })
    );
  }));

  xit("should update project on submit with image", fakeAsync(() => {}));
  xit("should update project on submit with image and description", fakeAsync(() => {}));

  it("should show success on successful submission", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(mockProject);
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
    expect(msg.innerText).toContain("Project was successfully updated.");
  }));

  it("should show error on duplicate project name", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Project>();

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

    const name = fixture.nativeElement.querySelectorAll("input")[0];
    name.value = "test project";
    name.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick(100);
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
    expect(msg).toBeTruthy();
    expect(msg.innerText).toContain(
      "Record could not be saved: name has already been taken"
    );
  }));

  it("should show error on duplicate project name", fakeAsync(() => {
    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Project>();

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

  it("should disable submit button during submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Project>();

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

  it("should re-enable submit button after submission", fakeAsync(() => {
    const button = fixture.nativeElement.querySelector("button[type='submit']");

    spyOn(component, "submit").and.callThrough();
    spyOn(api, "update").and.callFake(() => {
      const subject = new Subject<Project>();

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
