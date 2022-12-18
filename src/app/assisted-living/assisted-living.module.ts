import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistedLivingRoutingModule } from './assisted-living-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { OthersComponent } from './others/others.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NursesComponent,
    PhysiciansComponent,
    OthersComponent,
    AllChatsComponent
  ],
  imports: [
    CommonModule,
    AssistedLivingRoutingModule
  ]
})
export class AssistedLivingModule { }
