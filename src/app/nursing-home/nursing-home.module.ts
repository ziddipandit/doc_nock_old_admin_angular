import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NursingHomeRoutingModule } from './nursing-home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { OthersComponent } from './others/others.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
import { NurseModule } from '../nurse/nurse.module';


@NgModule({
  declarations: [
    DashboardComponent,
    NursesComponent,
    PhysiciansComponent,
    OthersComponent,
    AllChatsComponent,
    ChatDetailsComponent
  ],
  imports: [
    CommonModule,
    NursingHomeRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatTableExporterModule,
    MatCheckboxModule,
    FormsModule,
    NurseModule
  ],
  exports: [
    AllChatsComponent
  ]
})
export class NursingHomeModule { }
