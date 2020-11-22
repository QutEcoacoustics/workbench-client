import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheirSitesComponent } from './their-sites.component';

xdescribe('TheirSitesComponent', () => {
  let component: TheirSitesComponent;
  let fixture: ComponentFixture<TheirSitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheirSitesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TheirSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
