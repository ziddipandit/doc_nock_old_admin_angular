import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NurseRoutingModule } from './nurse-routing.module';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AudioRecordingService } from '../services/audio-recording.service';


@NgModule({
  declarations: [
    AllChatsComponent,
    PhysiciansComponent,
    ChatDetailsComponent
  ],
  imports: [
    CommonModule,
    NurseRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    MatCheckboxModule,
  ],
  providers: [
    AudioRecordingService
  ],
  exports: [
    AllChatsComponent,
    ChatDetailsComponent
  ]
})
export class NurseModule { }
