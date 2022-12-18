import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  nursingHomesCount: number = 0;
  physicianSCount: number = 0;
  nursesCount: number = 0;
  fullData: any = [];
  nurseList : any = [];
  physicianList: any;
  imageUrl : any;
  role:any;
  baseUrl : any = environment.apiUrl;
  constructor(
    private authService: AuthService,
    private commonServ: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.count();
    this.getPhysician();
    this.getNurses();
  }

  count(){
    this.commonServ.count().subscribe((res:any)=>{
      if(res.messageID == ResultType.SUCCESS){
        this.nursingHomesCount = res.data[0].nursing_homeLength;
        this.physicianSCount = res.data[0].physiciansLength;
        this.nursesCount = res.data[0].nurseLength;
      }
    });
  }

  getPhysician(){
    let  dataToPass = {
      role:"physician"
    };
    this.commonServ.getPhysicianAndNurses(dataToPass).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS){
        if(res.data != undefined && res.data != null){
          res.data.docs.map((el) => {
            if (el.image) {
              el.image = this.baseUrl + el.image;
            }
          })
          this.physicianList = res.data.docs;
        } 
      }
    });


  }

  getNurses(){
    const  dataToPass = {
      role: "nurse"
    };
    this.commonServ.getPhysicianAndNurses(dataToPass).subscribe((res: any) => {
      if(res.messageID == ResultType.SUCCESS){
        if(res.data != undefined && res.data != null){
          res.data.docs.map((el) => {
            if (el.image) {
              el.image = this.baseUrl + el.image;
            }
          })
          this.nurseList = res.data.docs;
        }
      } 
    });
  }
}
