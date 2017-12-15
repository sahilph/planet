import { Component, OnInit } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators, FormControlName } from '@angular/forms';
import { MatRadioModule , MatFormFieldModule, MatButtonModule, MatInputModule } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
   educationLevel: Array<any>= [ 1, 2, 3, 4, 5, 6 , 7, 8, 9, 11, 12, 'Higher' ];

  constructor(
    private couchService: CouchService,
    private fg: FormBuilder
    ) {
     this.registerForm = fg.group({
       firstName: [ '', Validators.required ],
       middleName: [ '', Validators.required ],
       lastName: [ '', Validators.required ],
       login: [ '', Validators.required ],
       email: [ '', Validators.required ],
       password: [ '', Validators.required ],
       repeatPassword: [ '', Validators.required ],
       language: [ '', Validators.required ],
       phoneNumber: [ '', Validators.required ],
       birthDay: [ '', Validators.required ],
       gender: [ '', Validators.required ],
       level: [ '', Validators.required ],
       community: [ '', Validators.required ],
       region: [ '', Validators.required ],
       nation: [ '', Validators.required ],

     });

  }

  ngOnInit() {
  }
  registerUser(userInfo: any ) {
    console.log(userInfo);
  }

}