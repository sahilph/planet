import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesAddComponent } from './courses-add.component';
import { FormErrorMessagesComponent } from '../../shared/form-error-messages.component';
<<<<<<< HEAD
import { CourseValidatorService } from 'app/validators/course-validator.service';
=======
import { ValidatorService } from 'app/validators/validator.service';
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
import { AlertsDeleteComponent } from '../../shared/alerts/alerts-delete.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CouchService } from '../../shared/couchdb.service';

describe('CoursesComponent', () => {
  let component: CoursesAddComponent;
  let fixture: ComponentFixture<CoursesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientModule ],
      declarations: [ CoursesAddComponent, FormErrorMessagesComponent, AlertsDeleteComponent ],
<<<<<<< HEAD
      providers: [ CouchService, CourseValidatorService ]
=======
      providers: [ CouchService, ValidatorService ]
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
