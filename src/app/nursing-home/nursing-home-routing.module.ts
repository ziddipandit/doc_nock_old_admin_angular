import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/route-guards/auth.guard';
import { NursingHomeGuard } from '../core/route-guards/nursing-home/nursing-home.guard';
import { CommonComponent } from '../layouts/common/common.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { ChatDetailsComponent } from '../nurse/chat/chat-details/chat-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { OthersComponent } from './others/others.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { AccountSettingsComponent } from '../super-admin/account-settings/account-settings.component';

const routes: Routes = [
  {
    path: 'nursing-home',
    component: CommonComponent,
    canActivate: [AuthGuard, NursingHomeGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'physicians', component: PhysiciansComponent },
      { path: 'nurses', component: NursesComponent },
      { path: 'others', component: OthersComponent },
      { path: 'chats', component: AllChatsComponent , children: [
        { path: ':chatId', component: ChatDetailsComponent }
      ]},
      { path: 'account-settings', component: AccountSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NursingHomeRoutingModule {}
