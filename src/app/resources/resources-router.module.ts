import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';
<<<<<<< HEAD
import { ResourcesViewComponent } from './resources-view.component';
=======
import { ResourcesViewComponent } from './view-resources/resources-view.component';
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
import { ResourcesAddComponent } from './resources-add.component';

const routes: Routes = [
  { path: '', component: ResourcesComponent },
  { path: 'view/:id', component: ResourcesViewComponent },
  { path: 'add', component: ResourcesAddComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ResourcesRouterModule {}
