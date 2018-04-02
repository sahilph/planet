import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DialogsPromptComponent } from '../shared/dialogs/dialogs-prompt.component';
import { PlanetMessageService } from '../shared/planet-message.service';
import { filterSpecificFields } from '../shared/table-helpers';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from '../shared/user.service';
import { findDocuments } from '../shared/mangoQueries';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './meetups.component.html',
  styles: [ `
    /* Column Widths */
    .mat-column-select {
      max-width: 44px;
    }
  ` ]
})
export class MeetupsComponent implements OnInit, AfterViewInit {
  meetups = new MatTableDataSource();
  displayedColumns = [ 'select', 'title' ];
  message = '';
  readonly dbName = 'meetups';
  deleteDialog: any;
  selection = new SelectionModel(true, []);

  constructor(
    private couchService: CouchService,
    private dialog: MatDialog,
    private planetMessageService: PlanetMessageService,
    private router: Router,
    private userService: UserService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.meetups.paginator = this.paginator;
    this.meetups.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.meetups.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.meetups.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.meetups.filter = filterValue;
  }

  getMeetups() {
    return this.couchService.get('meetups/_all_docs?include_docs=true');
      // .subscribe((data) => {
      //   // _all_docs returns object with rows array of objects with 'doc' property that has an object with the data.
      //   // Map over data.rows to remove the 'doc' property layer
      //   this.meetups.data = data.rows.map(meetup => meetup.doc);
      // }, (error) => this.planetMessageService.showAlert('There was a problem getting meetups'));
  }

  deleteClick(meetup) {
    this.deleteDialog = this.dialog.open(DialogsPromptComponent, {
      data: {
        okClick: this.deleteMeetup(meetup),
        changeType: 'delete',
        type: 'meetup',
        displayName: meetup.title
      }
    });
  }

  deleteMeetup(meetup) {
    // Return a function with community on its scope to pass to delete dialog
    return () => {
      const { _id: meetupId, _rev: meetupRev } = meetup;
      this.couchService.delete('meetups/' + meetupId + '?rev=' + meetupRev)
        .subscribe((data) => {
          // It's safer to remove the item from the array based on its id than to splice based on the index
          this.meetups.data = this.meetups.data.filter((meet: any) => data.id !== meet._id);
          this.selection.clear();
          this.deleteDialog.close();
          this.planetMessageService.showAlert('You have deleted Meetup ' + meetup.title);
        }, (error) => this.deleteDialog.componentInstance.message = 'There was a problem deleting this meetup');
    };
  }

  deleteMeetups(meetups) {
    // Deletes multiple meetups
    return () => {
      const deleteMeetupArr = meetups.map((meetup) => {
        return { _id: meetup._id, _rev: meetup._rev, _deleted: true };
      });
      this.couchService.post(this.dbName + '/_bulk_docs', { docs: deleteMeetupArr })
        .subscribe((data) => {
          this.getMeetups();
          this.selection.clear();
          this.deleteDialog.close();
          this.planetMessageService.showAlert('You have deleted selected meetups');
        }, (error) => this.deleteDialog.componentInstance.message = 'There was a problem deleting these meetups.');
      };
    }

  deleteSelected() {
    let amount = 'many',
      okClick = this.deleteMeetups(this.selection.selected),
      displayName = '';
    if (this.selection.selected.length === 1) {
      const meetup = this.selection.selected[0];
      amount = 'single';
      okClick = this.deleteMeetup(meetup);
      displayName = meetup.title;
    }
    this.openDeleteDialog(okClick, amount, displayName);
  }

  openDeleteDialog(okClick, amount, displayName = '') {
    this.deleteDialog = this.dialog.open(DialogsPromptComponent, {
      data: {
        okClick,
        amount,
        changeType: 'delete',
        type: 'meetup',
        displayName
      }
    });
    // Reset the message when the dialog closes
    this.deleteDialog.afterClosed().debug('Closing dialog').subscribe(() => {
      this.message = '';
    });
  }

  goBack() {
    this.router.navigate([ '/' ]);
  }

  ngOnInit() {
    forkJoin(this.getMeetups(), this.getUserMeetups()).subscribe((results) => {
      const meetupRes = results[0],
        userMeetupRes = results[1];
      this.setupList(meetupRes.rows, userMeetupRes.rows);
    }, (err) => console.log(err));
    this.meetups.filterPredicate = filterSpecificFields([ 'title', 'description' ]);
  }

  setupList(meetupRes, userMeetupRes) {
    this.meetups.data = meetupRes.map((m: any) => {
      const meetup = m.doc || m;
      const meetupIndex = userMeetupRes.findIndex(usermeetup => {
        return (meetup._id === usermeetup.doc.meetupId && usermeetup.doc.memberId.indexOf(this.userService.get().name) > -1);
      });
      if (meetupIndex > -1) {
        return { ...meetup, participate: true };
      }
      return { ...meetup,  participate: false };
    });
  }

  updateMeetup(meetup) {
    const { _id: meetupId } = meetup;
    this.router.navigate([ '/meetups/update/' + meetup._id ]);
  }

  getUserMeetups() {
    return this.couchService.get('usermeetups/_all_docs?include_docs=true');
  }

  attendMeetup(meetup) {
    this.couchService.post(`usermeetups/_find`,
      findDocuments({ 'meetupId': meetup._id }, 0 ))
      .pipe(switchMap(data => {
        const meetupInfo = { ...data.docs[0] };
        const memberId = meetupInfo.memberId;
        const username: string = this.userService.get().name;
        (memberId.indexOf(username) > -1) ? memberId.splice(memberId.indexOf(username), 1) : memberId.push(username);
        return this.couchService.put('usermeetups/' + meetupInfo._id , { ...meetupInfo, memberId });
      })).subscribe((res) => {
        const mData = this.meetups.data;
        if (mData.length > 0) {
          for (let i = 0; i < mData.length; i++ ) {
            if (mData[i]['id'] === res._id) {
              (this.meetups.data[i]['participate']) ?
                this.meetups.data[i]['participate'] = false : this.meetups.data[i]['participate'] = true;
            }
          }
        }
      });
  }

}
