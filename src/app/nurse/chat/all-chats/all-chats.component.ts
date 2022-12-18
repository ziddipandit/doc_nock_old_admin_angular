import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultType, UserInfo } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { WebSocketService } from 'src/app/super-admin/chat/web-socket.service';
import { environment } from 'src/environments/environment.prod';

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
  loggedInUserRole: string;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['name', 'select'];
  nurseDataSource = new MatTableDataSource<any[]>();
  othersDataSource = new MatTableDataSource<any[]>();
  physiciansDataSource = new MatTableDataSource<any[]>();
  minAllowedUsers: number = 2;
  selectedUserType: number = 1;
  groupSearch: string = "";

  constructor(
    private commonServ: CommonService,
    private router:Router,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  @ViewChild('groupDialog', { static: true }) groupDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.authService.user.subscribe((res: UserInfo) => {
      this.loggedInUserId = res._id;
      this.loggedInUserRole = res.role;
    });
    this.fetchAllGroups();
    this.getUsers();
  }

  getUsers(){
    try{
      this.dataSource = new MatTableDataSource<any[]>();
      if(this.loggedInUserRole == "nurse"){
        let nursingID = JSON.parse(localStorage.getItem('nursingID'));
        let data1 = {
          nursing_home_id: nursingID[0]._id,
        };
        this.commonServ.getAllPhysicians(data1).subscribe((res: any) => {
          if (res.messageID == ResultType.SUCCESS) {
            res.data.docs.map((el) => {
              let user = {_id: el._id, name: el.name, email: el.email, image: el.image};
              this.allNewPhysician.push(user);
              if (el.image && el.image != "null") {
                el.image = this.baseUrl + el.image;
              }
            });
            this.dataSource = new MatTableDataSource(res.data.docs);
          }
        });
      }
      if(this.loggedInUserRole == 'physician'){
        this.commonServ.associatedUsers().subscribe((res: any) => {
          if (res.messageID == ResultType.SUCCESS) {
            let users = [];
            res.data.physician.map((el) => {
              if (el.image && el.image != "null") {
                el.image = this.baseUrl + el.image;
              }
              users.push(el);
            });
            res.data.nurse.map((el) => {
              if (el.image && el.image != "null") {
                el.image = this.baseUrl + el.image;
              }
              users.push(el);
            });
            res.data.others.map((el) => {
              if (el.image && el.image != "null") {
                el.image = this.baseUrl + el.image;
              }
              users.push(el);
            });
            this.dataSource = new MatTableDataSource(users);
            this.physiciansDataSource = new MatTableDataSource(res.data.physician);
            this.nurseDataSource = new MatTableDataSource(res.data.nurse);
            this.othersDataSource = new MatTableDataSource(res.data.others);
          }
        });
      }
    } catch(ex) {
      console.log('Still loading');
    }
  }

  fetchAllGroups() {
    this.allGroupsChat = new MatTableDataSource<any[]>();
    let data = {
      senderId: this.loggedInUserId
    };
    this.webSocketService.joinRoom({user: '', room: this.loggedInUserId});
    this.webSocketService.fetchChats(data);
    
    this.webSocketService.userData().subscribe((res: any) => {
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
          el.chatName = this.formatCHatName(el.chatName);
        });
        this.allGroupsChat = new MatTableDataSource(res.data);
      }
    });
  }

  formatCHatName(chatName: string){
    if(chatName.length <= 25){
      return chatName;
    } else {
      let name = chatName.split(', ');
      return name[0] + ',.., '+ name[name.length - 1];
    }
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
  
  async createChatRoome(userId: string){
    const data = {senderId: this.loggedInUserId, user_id: userId};
    this.webSocketService.accessChat(data);
    await this.webSocketService.accessUserChat().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.router.navigate([this.loggedInUserRole+'/chats/'+res.data._id]);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
  
  openAddGroupDialog() {
    this.groupSearch = "";
    this.physiciansDataSource.filter = this.nurseDataSource.filter = this.othersDataSource.filter = "";
    this.dialog.open(this.groupDialog);
  }
  
  closeDialog() {
    this.dialog.closeAll();
  }
  
  selectHandler(row: any) {
    this.selection.toggle(row);
  }
  
  changeUserType(userType: number) {
    this.groupSearch = "";
    this.physiciansDataSource.filter = this.nurseDataSource.filter = this.othersDataSource.filter = "";
    this.selectedUserType = userType;
  }

  applyGroupFilter(filterValue: any) {
    if (this.selectedUserType == 1) {
      this.physiciansDataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
    if (this.selectedUserType == 2) {
      this.nurseDataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
    if (this.selectedUserType == 3) {
      this.othersDataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
  }

  createGroup() {
    if (this.selection.selected.length < this.minAllowedUsers) {
      this.toastr.error(`Min. ${this.minAllowedUsers} are required to create a group.`);
      return;
    }

    let users: any = [];
    let userNames: any = [];
    this.selection.selected.forEach((el) => {
      users.push(el._id);
      if(userNames.length < 2){
        userNames.push(el.name);
      }
    });
    let chatName = userNames.join(', ');
    if((users.length - userNames.length > 0)){
      chatName = chatName + ', +'+ (users.length - userNames.length);
    }
    const data: any = {
      user: users,
      name: chatName,
      senderId: this.loggedInUserId
    };
    this.webSocketService.createGroup(data);
    this.webSocketService.accessGroupInfo().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.selection.clear();
        this.closeDialog();
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

} 