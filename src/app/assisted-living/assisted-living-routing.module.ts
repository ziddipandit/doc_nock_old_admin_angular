import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/route-guards/auth.guard';
import { CommonComponent } from '../layouts/common/common.component';
import { AllChatsComponent } from './chat/all-chats/all-chats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NursesComponent } from './nurses/nurses.component';
import { OthersComponent } from './others/others.component';
import { PhysiciansComponent } from './physicians/physicians.component';

const routes: Routes = [
  {
    path: 'assisted-living',
    component: CommonComponent,
    canActivate: [],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'physicians', component: PhysiciansComponent },
      { path: 'nurses', component: NursesComponent },
      { path: 'others', component: OthersComponent },
      { path: 'chats', component: AllChatsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistedLivingRoutingModule { }
