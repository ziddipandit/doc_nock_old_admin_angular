import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../core/route-guards/login/login.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetupProfileComponent } from './setup-profile/setup-profile.component';

const routes: Routes = [
  {path: 'login', canActivate: [LoginGuard], component: LoginComponent},
  {path: 'forgot-password', canActivate: [LoginGuard], component: ForgotPasswordComponent},
  {path: 'reset-password/:token', canActivate:[LoginGuard], component: ResetPasswordComponent},
  {path: 'setup-profile/:token', canActivate: [LoginGuard], component: SetupProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
