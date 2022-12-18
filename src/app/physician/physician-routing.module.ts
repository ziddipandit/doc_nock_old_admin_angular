import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/route-guards/auth.guard';
import { CommonComponent } from '../layouts/common/common.component';
import { AllChatsComponent } from '../nurse/chat/all-chats/all-chats.component';
import { ChatDetailsComponent } from '../nurse/chat/chat-details/chat-details.component';
import { AccountSettingsComponent } from '../super-admin/account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { NursingHomesComponent } from './nursing-homes/nursing-homes.component';

const routes: Routes = [
  {
    path: 'physician',
    component: CommonComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'nursing-homes', component: NursingHomesComponent },
      { path: 'nurses', component: NursesComponent },
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
export class PhysicianRoutingModule { }
