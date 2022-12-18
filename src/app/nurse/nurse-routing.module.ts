import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/route-guards/auth.guard';
import { CommonComponent } from '../layouts/common/common.component';
import { AccountSettingsComponent } from '../super-admin/account-settings/account-settings.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { PhysiciansComponent } from './physicians/physicians.component';

const routes: Routes = [
  {
    path: 'nurse',
    component: CommonComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: PhysiciansComponent },
      { path: 'chats', component: AllChatsComponent , children: [
        { path: ':chatId', component: ChatDetailsComponent }
      ]},
      { path: 'account-settings', component: AccountSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NurseRoutingModule { }
