import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupProfileComponent } from './setup-profile/setup-profile.component';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SetupProfileComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
