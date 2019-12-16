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
import { SitesService } from "src/app/services/baw-api/sites.service";
import { EditComponent } from "./edit.component";

describe("ProfileEditComponent", () => {
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
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
