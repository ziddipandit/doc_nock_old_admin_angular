import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResultType, UserInfo } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss']
})
export class AllChatsComponent implements OnInit {

  allGroupsChat = new MatTableDataSource<any[]>();
  chatsDisplayedColumns: string[] = ['groupName'];
  dataSource = new MatTableDataSource<any[]>();
  baseUrl: any = environment.apiUrl;
  selectedTab: number = 1;
  chattedUsers: any = [];
  allNewPhysician: any = [];
  loggedInUserId: string;

  constructor(
    private commonServ: CommonService,
    private router:Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe((res: UserInfo) => {
      this.loggedInUserId = res._id;
    });
    this.fetchAllGroups();
    this.getNurses();
  }

  getNurses(){
    try{
      this.dataSource = new MatTableDataSource<any[]>();
      this.commonServ.associatedNures().subscribe((res: any) => {
        if (res.messageID == ResultType.SUCCESS) {
          res.data.map((el) => {
            if (el.image && el.image != "null") {
              el.image = this.baseUrl + el.image;
            }
          });
          this.dataSource = new MatTableDataSource(res.data);
        }
      });
    } catch(ex) {
      console.log('Still loading');
    }
  }

  fetchAllGroups() {
    this.allGroupsChat = new MatTableDataSource<any[]>();
    this.commonServ.fetchAllGroups().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.map((el) => {
          if(!el.isGroupChat){
            el.users.forEach(element => {
              if(element._id != this.loggedInUserId){
                el.chatName = element.name;
                if (element.image && element.image != "null") {
                  el.image = this.baseUrl + element.image;
                }
                el.role = element.role;
              }
            });
          }
        });
        this.allGroupsChat = new MatTableDataSource(res.data);
      }
    });
  }

  toggleSelectedTab(tabIndex: number) {
    this.selectedTab = tabIndex;
    if(this.selectedTab == 1){
      this.fetchAllGroups();
    }
    this.allGroupsChat.filter = this.dataSource.filter = "";
  }

  getDummyImage(role: string) {
    return this.commonServ.getDummyImage(role);
  }

  applyFilter(filterValue: any){
    if(this.selectedTab == 1){
      this.allGroupsChat.filter = filterValue.target.value.trim().toLowerCase();
    } else {
      this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
  }

  createChatRoome(userId: string){
    let data = {user_id: userId};
   this.commonServ.createChatRoom(data).subscribe((res: any) => {
    if (res.messageID == ResultType.SUCCESS) {
      this.router.navigate(['physician/chats/'+res.data._id]);
    }
  });
 }
}