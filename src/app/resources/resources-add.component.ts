import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../shared/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CouchService } from '../shared/couchdb.service';
import { ValidatorService } from '../validators/validator.service';
import * as constants from './resources-constants';

import * as JSZip from 'jszip';
import * as mime from 'mime-types';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PlanetMessageService } from '../shared/planet-message.service';

@Component({
  templateUrl: './resources-add.component.html'
})

export class ResourcesAddComponent implements OnInit {
  subjects = new FormControl();
  levels = new FormControl();
  subjectList: string[];
  levelList: string[];
  media: string[];
  openWith: string[];
  resourceType: string[];
  currentDate = new Date();
  file: any;
  resourceForm: FormGroup;
  readonly dbName = 'resources'; // make database name a constant
  userDetail: any = {};
  id = null;
  revision = null;
  fileName = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private couchService: CouchService,
    private validatorService: ValidatorService,
    private userService: UserService,
    private planetMessageService: PlanetMessageService,
    private route: ActivatedRoute
  ) {
    // Adds the dropdown lists to this component
    Object.assign(this, constants);
    this.createForm();
  }

  ngOnInit() {
    this.userDetail = this.userService.get();
        // update resource url check
    if (this.route.snapshot.url[0].path === 'update') {
      this.couchService.get('resources/' + this.route.snapshot.paramMap.get('id'))
      .subscribe((data) => {
        this.revision = data._rev;
        // this.fileName = (data.hasOwnProperty('_attachments')) ? data._attachments[0] : '';
        this.resourceForm.patchValue(data);
      }, (error) => {
        console.log(error);
      });
    }

  }

  createForm() {
    this.resourceForm = this.fb.group({
      title: [
        '',
        Validators.required,
        // an arrow function is for lexically binding 'this' otherwise 'this' would be undefined
        this.route.snapshot.url[0].path === 'update'
       ?  ac => this.validatorService.isNameAvailible$(this.dbName, 'title', ac, this.route.snapshot.params.id)
       : ac => this.validatorService.isUnique$(this.dbName, 'title', ac)
      ],
      author: '',
      year: '',
      description: [ '', Validators.required ],
      language: '',
      publisher: '',
      linkToLicense: '',
      subject: [ '', Validators.required ],
      level: [ '', Validators.required ],
      openWith: '',
      resourceFor: [],
      medium: '',
      articleDate: '',
      resourceType: '',
      addedBy: '',
      openUrl: [],
      openWhichFile: '',
      isDownloadable: '',
    });
  }

  // Function which takes a MIME Type as a string and returns whether the file is an
  // image, audio file, video, pdf, or zip.  If none of those five returns 'other'
  private simpleMediaType (mimeType: string) {
    const mediaTypes = [ 'image', 'pdf', 'audio', 'video', 'zip' ];
    return mediaTypes.find((type) => mimeType.indexOf(type) > -1) || 'other';
  }

  // Creates an observer which reads one file then outputs its data
  private fileReaderObs (file, mediaType) {
    const reader = new FileReader();
    const obs = Observable.create((observer) => {
      reader.onload = () => {
        // FileReader result has file type at start of string, need to remove for CouchDB
        const fileData = reader.result.split(',')[1],
          attachments = {};
        attachments[file.name] = {
          content_type: file.type,
          data: fileData
        };
        const resource = {
          filename: file.name,
          _attachments: attachments,
          mediaType: mediaType
        };
        observer.next(resource);
        observer.complete();
      };
    });
    reader.readAsDataURL(file);
    return obs;
  }

  updateResource(resourceInfo) {
    this.couchService.put(this.dbName + '/' + this.id, { ...resourceInfo, '_rev': this.revision  }).subscribe(() => {
      this.router.navigate([ '/resources' ]);
      this.planetMessageService.showMessage('Resource Updated Successfully');
    }, (err) => {
      console.log(err);
    });
  }

  onSubmit() {
    if (this.resourceForm.valid) {
      let fileObs: Observable<any>;
      // If file doesn't exist, mediaType will be undefined
      const mediaType = this.file && this.simpleMediaType(this.file.type);
      switch (mediaType) {
        case undefined:
          // Creates an observable that immediately returns an empty object
          fileObs = of({});
          break;
        case 'zip':
          fileObs = this.zipObs(this.file);
          break;
        default:
          fileObs = this.fileReaderObs(this.file, mediaType);
      }
      fileObs.debug('Preparing file for upload').subscribe((resource) => {
        // Start with empty object so this.resourceForm.value does not change
        if (this.route.snapshot.url[0].path === 'update') {
          this.updateResource(Object.assign({}, this.resourceForm.value, resource));
        } else {
          this.addResource(Object.assign({}, this.resourceForm.value, resource));
        }
      });
    } else {
      Object.keys(this.resourceForm.controls).forEach(field => {
        const control = this.resourceForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  addResource(resourceInfo) {
    // convert articleDate in Date format to timestamp format
    resourceInfo.articleDate = Date.now();
    // ...is the rest syntax for object destructuring
    this.couchService.post(this.dbName, { ...resourceInfo }).subscribe(() => {
      this.router.navigate([ '/resources' ]);
      this.planetMessageService.showMessage('New Resource Created');
    }, (err) => {
      // Connect to an error display component to show user that an error has occurred
      console.log(err);
    });
  }

  // Returns a function which takes a file name located in the zip file and returns an observer
  // which resolves with the file's data
  private processZip (zipFile) {
    return function(fileName) {
      return Observable.create((observer) => {
        // When file was not read error block wasn't called from async so added try...catch block
        try {
          zipFile.file(fileName).async('base64').then(function success(data) {
            observer.next({ name: fileName, data: data });
            observer.complete();
          }, function error(e) {
            observer.error(e);
          });
        } catch (e) {
          console.log(fileName + ' has caused error.');
          observer.error(e);
        }
      });
    };
  }

  zipObs(zipFile) {
    const zip = new JSZip();
    return Observable.create((observer) => {
      // This loads an object with file information from the zip, but not the data of the files
      zip.loadAsync(zipFile).then((data) => {
        const fileNames = [];
        // Add file names to array for mapping
        for (const path in data.files) {
          if (!data.files[path].dir && path.indexOf('DS_Store') === -1) {
            fileNames.push(path);
          }
        }
        // Since files are loaded async, use forkJoin Observer to ensure all data from the files are loaded before attempting upload
        forkJoin(fileNames.map(this.processZip(zip))).debug('Unpacking zip file').subscribe((filesArray) => {
          // Create object in format for multiple attachment upload to CouchDB
          const filesObj = filesArray.reduce((newFilesObj: any, file: any) => {
            // Default to text/plain if no mime type found
            const fileType = mime.lookup(file.name) || 'text/plain';
            newFilesObj[file.name] = { data: file.data, content_type: fileType };
            return newFilesObj;
          }, {});
          // Leave filename blank (since it is many files) and call mediaType 'HTML'
          observer.next({ filename: '', mediaType: 'HTML', _attachments: filesObj });
          observer.complete();
        }, (error) => {
          console.log(error);
          observer.error(error);
        });
      });
    });
  }

  cancel() {
    this.router.navigate([ '/resources' ]);
  }

  bindFile(event) {
    this.file = event.target.files[0];
  }

}
