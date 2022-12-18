import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/route-guards/admin/admin.guard';
import { AuthGuard } from '../core/route-guards/auth.guard';
import { CommonComponent } from '../layouts/common/common.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AssistedLivingsComponent } from './assisted-livings/assisted-livings.component';
import { AllChatsComponent } from '../nursing-home/chat/all-chats/all-chats.component';
import { ChatDetailsComponent } from '../nurse/chat/chat-details/chat-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { NursingHomesComponent } from './nursing-homes/nursing-homes.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { SubAdminsComponent } from './sub-admins/sub-admins.component';

const routes: Routes = [
  {
    path: 'admin',
    component: CommonComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'assisted-livings', component: AssistedLivingsComponent },
      { path: 'nursing-home', component: NursingHomesComponent },
      { path: 'physicians', component: PhysiciansComponent },
      { path: 'nurses', component: NursesComponent },
      { path: 'chats', component: AllChatsComponent , children: [
        { path: ':chatId', component: ChatDetailsComponent }
      ]},
      { path: 'sub-admins', component: SubAdminsComponent },
      { path: 'account-settings', component: AccountSettingsComponent },
    ],
  },
  {
    path: 'sub-admin',
    component: CommonComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'assisted-livings', component: AssistedLivingsComponent },
      { path: 'nursing-home', component: NursingHomesComponent },
      { path: 'physicians', component: PhysiciansComponent },
      { path: 'nurses', component: NursesComponent },
      { path: 'chats', component: AllChatsComponent , children: [
        { path: ':chatId', component: ChatDetailsComponent }
      ]},
      { path: 'sub-admins', component: SubAdminsComponent },
      { path: 'account-settings', component: AccountSettingsComponent },
      { path: 'chat-details', component: ChatDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
