import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesComponent } from './courses.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CouchService } from '../shared/couchdb.service';
import { HttpClientModule } from '@angular/common/http';
<<<<<<< HEAD
import { CourseValidatorService } from '../validators/course-validator.service';
=======

>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
import { FormErrorMessagesComponent } from '../shared/form-error-messages.component';
import { AlertsDeleteComponent } from '../shared/alerts/alerts-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientModule, BrowserAnimationsModule ],
      declarations: [ CoursesComponent, FormErrorMessagesComponent, AlertsDeleteComponent ],
<<<<<<< HEAD
      providers: [ CouchService, CourseValidatorService ]
=======
      providers: [ CouchService ]
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
