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
});
