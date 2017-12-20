import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanetFormsModule } from '../shared/planet-forms.module';
import { ResourcesComponent } from './resources.component';
<<<<<<< HEAD
import { ResourcesViewComponent } from './resources-view.component';
import { ResourcesAddComponent } from './resources-add.component';
import { ResourcesRouterModule } from './resources-router.module';
import { MaterialModule } from '../shared/material.module';
import { ResourceValidatorService } from '../validators/resource-validator.service';
=======
import { ResourcesViewComponent } from './view-resources/resources-view.component';
import { ResourcesAddComponent } from './resources-add.component';
import { ResourcesRouterModule } from './resources-router.module';
import { MaterialModule } from '../shared/material.module';
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlanetFormsModule,
    ResourcesRouterModule,
    MaterialModule
  ],
  declarations: [ ResourcesComponent, ResourcesViewComponent, ResourcesAddComponent ],
<<<<<<< HEAD
  providers: [ ResourceValidatorService ]
=======
>>>>>>> 7a9d14669fae0f6573e2988a4f4b5f4832e881c5
})
export class ResourcesModule {}
