import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '@services/app-config/app-config.service';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { SharedModule } from '@shared/shared.module';
import { appLibraryImports } from 'src/app/app.module';
import { DataRequestComponent } from './data-request.component';

xdescribe('DataRequestComponent', () => {
  let httpMock: HttpTestingController;
  let component: DataRequestComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [DataRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRequestComponent);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
