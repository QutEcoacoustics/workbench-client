import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { MockBawApiModule } from '@baw-api/baw-apiMock.module';
import {
  tagGroupResolvers,
  TagGroupsService,
} from '@baw-api/tag/tag-group.service';
import { TagGroup } from '@models/TagGroup';
import { SpyObject } from '@ngneat/spectator';
import { SharedModule } from '@shared/shared.module';
import { generateApiErrorDetails } from '@test/fakes/ApiErrorDetails';
import { generateTagGroup } from '@test/fakes/TagGroup';
import { assertErrorHandler } from '@test/helpers/html';
import { mockActivatedRoute } from '@test/helpers/testbed';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { appLibraryImports } from 'src/app/app.module';
import { AdminTagGroupsEditComponent } from './edit.component';

describe('AdminTagGroupsEditComponent', () => {
  let api: SpyObject<TagGroupsService>;
  let component: AdminTagGroupsEditComponent;
  let defaultTagGroup: TagGroup;
  let fixture: ComponentFixture<AdminTagGroupsEditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(model: TagGroup, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminTagGroupsEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { tagGroup: tagGroupResolvers.show },
            { tagGroup: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTagGroupsEditComponent);
    api = TestBed.inject(TagGroupsService) as SpyObject<TagGroupsService>;
    router = TestBed.inject(Router);
    notifications = TestBed.inject(ToastrService);
    component = fixture.componentInstance;

    spyOn(notifications, 'success').and.stub();
    spyOn(notifications, 'error').and.stub();
    spyOn(router, 'navigateByUrl').and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultTagGroup = new TagGroup(generateTagGroup());
  });

  xdescribe('form', () => {});

  describe('component', () => {
    it('should create', () => {
      configureTestingModule(defaultTagGroup);
      expect(component).toBeTruthy();
    });

    it('should handle tag group error', () => {
      configureTestingModule(undefined, generateApiErrorDetails());
      assertErrorHandler(fixture);
    });

    it('should call api', () => {
      configureTestingModule(defaultTagGroup);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
