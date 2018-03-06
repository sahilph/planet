import { Component, OnInit } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
import { UserService } from '../shared/user.service';

@Component({
  template: `
    <div *ngIf="displayDashboard && planet_type !== 'community'">
      <a routerLink="/requests" i18n mat-raised-button>Requests</a>
      <a routerLink="/associated/{{ planet_type === 'center' ? 'nation' : 'community' }}" i18n mat-raised-button>{{ planet_type === 'center' ? 'Nation' : 'Community' }}</a>
    </div>
    <div>{{message}}</div>
  `
})

export class ManagerDashboardComponent implements OnInit {
  isUserAdmin = false;
  displayDashboard = true;
  message = '';
  planet_type = [];
  constructor(private couchService: CouchService) {}

  ngOnInit() {
    Object.assign(this, this.userService.get());
    if (!this.isUserAdmin) {
      // A non-admin user cannot receive all user docs
      this.displayDashboard = false;
      this.message = 'Access restricted to admins';
    }
    this.couchService.get('configurations/_all_docs?include_docs=true')
      .subscribe((response) => {
        this.planet_type = response.rows[0].doc.planet_type;
      }, (error) => console.log('Error'));
  }

}
