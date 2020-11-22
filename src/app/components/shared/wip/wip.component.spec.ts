import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAppConfigModule } from '@services/app-config/app-configMock.module';
import { appLibraryImports } from 'src/app/app.module';
import { SharedModule } from '../shared.module';
import { WIPComponent } from './wip.component';

describe('WIPComponent', () => {
  let component: WIPComponent;
  let fixture: ComponentFixture<WIPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, MockAppConfigModule],
      declarations: [WIPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO Add tests
});
