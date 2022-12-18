import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  redirectUrl: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if(this.authService.isUserLoggedIn()){
      this.redirectUrl = this.authService.redirectTo();
    } else {
      this.redirectUrl = 'login';
    }
  }

}
