import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhysicianRoutingModule } from './physician-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { NursingHomesComponent } from './nursing-homes/nursing-homes.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
import { NurseModule } from '../nurse/nurse.module';


@NgModule({
  declarations: [
    DashboardComponent,
    NursesComponent,
    NursingHomesComponent,
    AllChatsComponent,
    ChatDetailsComponent
  ],
  imports: [
    CommonModule,
    PhysicianRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NurseModule
  ]
})
export class PhysicianModule { }
