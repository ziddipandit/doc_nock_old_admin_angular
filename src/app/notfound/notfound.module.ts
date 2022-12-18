import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotfoundRoutingModule } from './notfound-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    NotfoundRoutingModule
  ]
})
export class NotfoundModule { }
