import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BnNgIdleService } from "bn-ng-idle";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Care Communication';

  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if(isTimedOut && this.authService.isUserLoggedIn()){
        this.toastr.error('Session Expired!');
        this.dialog.closeAll();
        this.authService.logout();
        this.router.navigateByUrl('login');
      }
    });
    this.redirectUser();
  }

  redirectUser(){
    window.addEventListener('storage', (event) => {
      if (event.storageArea && event.storageArea.length == 0) {
        let token = localStorage.getItem('access_token');
        if(token == undefined || token == null) {
          this.authService.logout();
          this.router.navigateByUrl('login');
        }
      } else if (event.storageArea && event.storageArea.length > 0) {
        window.location.reload();
      }
    }, true);
  }
}
