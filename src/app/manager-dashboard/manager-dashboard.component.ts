import { Component, OnInit } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
@Component({
  template: `
    <div *ngIf="planet_type !== 'community'"><a routerLink="/requests" i18n mat-raised-button>Requests</a> <a routerLink="/associated/{{ planet_type === 'center' ? 'nation' : 'community' }}" i18n mat-raised-button>{{ planet_type === 'center' ? 'Nation' : 'Community' }}</a></div>
  `
})
export class ManagerDashboardComponent implements OnInit {

  constructor(private couchService: CouchService) {}
  planet_type = [];

  ngOnInit() {
    this.couchService.get('configurations/_all_docs?include_docs=true')
      .subscribe((response) => {
        this.planet_type = response.rows[0].doc.planet_type;
      }, (error) => console.log('Error'));
  }

}
