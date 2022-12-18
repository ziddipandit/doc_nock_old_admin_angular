import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LayoutsRoutingModule } from './layouts-routing.module';
import { CommonComponent } from './common/common.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    CommonComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule
    
  ],
  exports: [
    CommonComponent
  ]
})
export class LayoutsModule { }
