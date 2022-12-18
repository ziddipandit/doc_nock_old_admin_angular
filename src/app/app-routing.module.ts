import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './notfound/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: "login", pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
