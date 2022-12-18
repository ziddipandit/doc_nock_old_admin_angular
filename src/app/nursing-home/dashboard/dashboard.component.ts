import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  physiciansCount: number = 0;
  nursesCount: number = 0;
  nursingHomeId: string;
  baseUrl: string;
  nursesData: any;
  physiciansData: any;

  constructor(
    private authService: AuthService,
    private commonServ: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.baseUrl = this.commonServ.baseURL;
    this.nursingHomeId = this.authService.getLoggedInUserId();
    this.getDashboardData();
  }

  getDashboardData(){
    try{
      let data1 = {
        nursing_home_id: this.nursingHomeId
      };
      this.commonServ.getAllNurses(data1).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el)=>{
            if (el.image && el.image != "null") {
              el.image =this.baseUrl +  el.image;
            }
          });
          this.nursesData = res.data.docs;
          this.nursesCount = this.nursesData.length;
        }
      });
      this.commonServ.getAllPhysicians(data1).subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.docs.map((el)=>{
            if (el.image && el.image != "null") {
              el.image =this.baseUrl +  el.image;
            }
          });
          this.physiciansData = res.data.docs;
          this.physiciansCount = this.physiciansData.length;
        }
      });
    } catch (ex) {
      console.log('Still loading');
    }
  }
}
