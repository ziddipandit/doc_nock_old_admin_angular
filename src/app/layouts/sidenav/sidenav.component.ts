import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  role: any;


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(res => {
      if(res != null){
        this.role = res.role;
      }
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

}
