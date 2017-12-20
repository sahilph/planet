import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
<<<<<<< HEAD
import { Headers } from '@angular/http';
import { DialogsDeleteComponent } from '../shared/dialogs/dialogs-delete.component';
import { MatDialog } from '@angular/material';
=======
import { DialogsDeleteComponent } from '../shared/dialogs/dialogs-delete.component';
import { MatTableDataSource, MatPaginator, MatFormField, MatFormFieldControl, MatDialog, MatDialogRef } from '@angular/material';
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5

@Component({
  templateUrl: './resources.component.html'
})
<<<<<<< HEAD
export class ResourcesComponent implements OnInit {
  rating;
  mRating;
  fRating;
  resources = [];
  message = '';
  file: any;
  resource = { mediaType: '' };
=======
export class ResourcesComponent implements OnInit, AfterViewInit {
  resources = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = [ 'title', 'rating' ];
  readonly dbName = 'resources';
  mRating;
  fRating;
  message = '';
  file: any;
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
  deleteDialog: any;

  getRating(sum, timesRated) {
    let rating = 0;
    if (sum > 0 && timesRated > 0) {
      rating = sum / timesRated;
    }
<<<<<<< HEAD
    return this.rating;
=======
    // Multiply by 20 to convert rating out of 5 to percent for width
    return (rating * 20) + '%';
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
  }

  constructor(private couchService: CouchService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getResources();
    // Temp fields to fill in for male and female rating
    this.fRating = Math.floor(Math.random() * 101);
    this.mRating = 100 - this.fRating;
  }

<<<<<<< HEAD
=======
  ngAfterViewInit() {
    this.resources.paginator = this.paginator;
  }

  applyResFilter(filterResValue: string) {
    this.resources.filter = filterResValue.trim().toLowerCase();
  }

>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
  getResources() {
    this.couchService
      .get(this.dbName + '/_all_docs?include_docs=true')
      .then(data => {
        this.resources.data = data.rows.map(res => res.doc);
      }, error => (this.message = 'Error'));
  }

  deleteClick(resource) {
    this.deleteDialog = this.dialog.open(DialogsDeleteComponent, {
      data: {
        okClick: this.deleteResource(resource),
        type: 'resource',
        displayName: resource.title
      }
    });
    // Reset the message when the dialog closes
    this.deleteDialog.afterClosed().subscribe(() => {
      this.message = '';
    });
  }

  deleteResource(resource) {
    return () => {
      const { _id: resourceId, _rev: resourceRev } = resource;
<<<<<<< HEAD
      this.couchService.delete('resources/' + resourceId + '?rev=' + resourceRev)
        .then((data) => {
          this.resources = this.resources.filter((res: any) => data.id !== res.id);
=======
      this.couchService.delete(this.dbName + '/' + resourceId + '?rev=' + resourceRev)
        .then((data) => {
          this.resources.data = this.resources.data.filter((res: any) => data.id !== res._id);
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
          this.deleteDialog.close();
        }, (error) => this.deleteDialog.componentInstance.message = 'There was a problem deleting this resource.');
    };
  }

}
