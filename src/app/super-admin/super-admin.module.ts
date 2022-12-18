import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AssistedLivingsComponent } from './assisted-livings/assisted-livings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { NursesComponent } from './nurses/nurses.component';
import { NursingHomesComponent } from './nursing-homes/nursing-homes.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { SubAdminsComponent } from './sub-admins/sub-admins.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NursingHomeModule } from '../nursing-home/nursing-home.module';
import { NurseModule } from '../nurse/nurse.module';

@NgModule({
  declarations: [
    AccountSettingsComponent,
    AssistedLivingsComponent,
    DashboardComponent,
    AllChatsComponent,
    ChatDetailsComponent,
    NursesComponent,
    NursingHomesComponent,
    PhysiciansComponent,
    SubAdminsComponent,
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    NurseModule,
    NursingHomeModule
  ],
  exports: [
    AccountSettingsComponent
  ]
})
export class SuperAdminModule { }
