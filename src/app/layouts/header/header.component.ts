import { Component, OnInit } from '@angular/core';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  username: string = '';
  role: string;
  userId: any;
  baseUrl: any = environment.apiUrl;
  imageURL: any;
  defaultStatus: any = '';
  nursingHomeList: any;

  constructor(
    private authService: AuthService,
    private commonServ: CommonService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((res) => {
      if (res != null) {
        this.username = res.name;
        this.role = res.role;
        if (res.image != undefined && res.image != null) {
          this.imageURL = this.baseUrl + res.image;
        } else {
          this.getProfilePic();
        }
      }
    });
    this.getNursingHome();
  }

  getCurrentUser() {
    let dataToPass = {
      _id: this.userId,
    };
    this.commonServ.getCurrentUser(dataToPass).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        if (res.data.image !== undefined && res.data.image !== null) {
          this.imageURL = this.baseUrl + res.data.image;
        }
      }
    });
  }

  getProfilePic() {
    if (this.role == 'nursing_home') {
      this.imageURL = 'assets/images/nursing-room.png';
    } else if (this.role == 'nurse') {
      this.imageURL = 'assets/images/nurselogo.png';
    } else if (this.role == 'physician') {
      this.imageURL = 'assets/images/doctor.png';
    } else {
      this.imageURL = 'assets/images/user.png';
    }
  }
  filterByStatus(event: any) {
    this.defaultStatus = event.target.value;
    this.getNursesAndPhysicians(event)
  }
  getNursingHome() {
    try {
      const data: any = { status: this.defaultStatus };
      this.commonServ.getAllNursingHomes(data).subscribe((res: any) => {
        
        if (res.messageID == ResultType.SUCCESS) {
          this.nursingHomeList = res.data.docs;
          
        }
      });
    } catch (ex) {
      console.log('Still loading');
    }
  }



  getNursesAndPhysicians(e){
    try{
      const data = {
        nursing_home_id:e.target.value
      };
      this.commonServ.listDashboard(data).subscribe((data:any)=>{
      })

    }catch(e){

    }


  }
}
