// import { HttpClientModule } from "@angular/common/http";
// import {
//   async,
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick
// } from "@angular/core/testing";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
// import { FormlyModule } from "@ngx-formly/core";
// import { validationMessages } from "src/app/app.helper";
// import { FormComponent } from "./form.component";

// describe("FormComponent", () => {
//   let component: FormComponent;
//   let fixture: ComponentFixture<FormComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientModule,
//         NgbModule,
//         FormsModule,
//         ReactiveFormsModule,
//         FormlyModule.forRoot({
//           validationMessages
//         }),
//         FormlyBootstrapModule
//       ],
//       declarations: [FormComponent]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(FormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   // TODO Implement this test
//   /*xit("should display bootstrap alert message with missing email", fakeAsync(() => {
//     const button = fixture.debugElement.nativeElement.querySelector("button");
//     button.click();

//     let count = 0;
//     while (
//       !fixture.debugElement.nativeElement.querySelector("ngb-alert") &&
//       count < 10
//     ) {
//       tick();
//       fixture.detectChanges();
//       count++;
//     }

//     const msg = fixture.debugElement.nativeElement.querySelector("ngb-alert");
//     expect(msg).toBeTruthy();
//     expect(msg.innerText).toBeTruthy();
//     expect(msg.innerText.length).toBeGreaterThan(3);
//   }));*/
// });
