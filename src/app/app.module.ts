import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpHeaderInterceptor } from './interceptors/http-header.interceptor';
import { NursingHomeModule } from './nursing-home/nursing-home.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxPaginationModule } from 'ngx-pagination';
import { LayoutsModule } from './layouts/layouts.module';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from "ngx-ui-loader";
import { environment } from ".//../environments/environment";
import { AssistedLivingModule } from './assisted-living/assisted-living.module';
import { NurseModule } from './nurse/nurse.module';
import { PhysicianModule } from './physician/physician.module';
import { NotfoundModule } from './notfound/notfound.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    SuperAdminModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule,
    HttpClientModule,
    MatDialogModule,
    NursingHomeModule,
    LayoutsModule,
    NgxPaginationModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      exclude: [
        // environment.apiUrl+ 'all-nursinghomes',
        // environment.apiUrl+ 'all-assistedliving',
        // environment.apiUrl+ 'all-physicians',
        // environment.apiUrl+ 'all-nurses',
        // environment.apiUrl+ 'list-nursinghome',
        // environment.apiUrl+ 'list-assistlive',
        // environment.apiUrl+ 'all-subadmin',
        // environment.apiUrl+ 'all-subadmin',
        // environment.apiUrl+ 'associated-nursing-homes',
        // environment.apiUrl+ 'associated-nurses-list-data',
        // environment.apiUrl+ 'associated-nursing-homes-list',
        // environment.apiUrl+ 'associated-nurses-list',
        // environment.apiUrl+ 'other-listing',
        // environment.apiUrl+ 'count',
        // environment.apiUrl+ 'all-physician-nurses',
        // environment.apiUrl+ 'fetch-chat',
        // environment.apiUrl+ 'send-message',
        // environment.apiUrl+ 'get-messages',
        // environment.apiUrl+ 'access-chat',
        // environment.apiUrl+ 'upload-message-image',
        // environment.apiUrl+ 'associantedAllData',
       
        
      ],
      showForeground: true 
    }),
    AssistedLivingModule,
    NurseModule,
    PhysicianModule,
    NotfoundModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeaderInterceptor,
    multi: true
  }, BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
