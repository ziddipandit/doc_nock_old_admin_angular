import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ResultType, UserInfo } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { WebSocketService } from 'src/app/super-admin/chat/web-socket.service';


@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss']
})
export class AllChatsComponent implements OnInit {

  selectedTab: number = 1;
  selectedUserType: number = 1;
  nursingHomeId: string;
  baseUrl: string;
  displayedColumns: string[] = ['name', 'select'];
  chatsDisplayedColumns: string[] = ['groupName'];
  dataSource = new MatTableDataSource<any[]>();
  nurseDataSource = new MatTableDataSource<any[]>();
  othersDataSource = new MatTableDataSource<any[]>();
  groupForm: any;
  selection = new SelectionModel<any>(true, []);
  imageURL: string;
  minAllowedUsers: number = 2;
  allGroupsChat = new MatTableDataSource<any[]>();
  loggedInUserId: string;
  loggedInUserRole: string;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private commonServ: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private webSocketService: WebSocketService
  ) { }

  @ViewChild('groupDialog', { static: true }) groupDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.authService.user.subscribe((res: UserInfo) => {
      this.loggedInUserId = res._id;
      this.loggedInUserRole = res.role;
      this.webSocketService.joinRoom({user: '', room: this.loggedInUserId});
    });
    this.baseUrl = this.commonServ.baseURL;
    this.nursingHomeId = this.authService.getLoggedInUserId();
    this.fetchAllGroups();
    this.getUsersForGroupCreation();
    this.initializeGroupForm();
  }

  toggleSelectedTab(tabIndex: number) {
    this.selectedTab = tabIndex;
  }

  initializeGroupForm(): void {
    this.groupForm = this.fb.group({
      filter: ['', []],
      physicians: this.fb.array([])
    });
  }

  openAddGroupDialog() {
    this.groupForm.patchValue({
      filter: ""
    });
    this.dialog.open(this.groupDialog);
  }

  changeUserType(userType: number) {
    this.groupForm.patchValue({
      filter: ""
    });
    this.dataSource.filter = this.nurseDataSource.filter = this.othersDataSource.filter = '';
    this.selectedUserType = userType;
  }

  getUsersForGroupCreation() {
    let data1 = {
      nursing_home_id: this.nursingHomeId
      
    };

    //PhysiciansData
    this.commonServ.getAllPhysicians(data1).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
       
    this.dataSource = new MatTableDataSource<any[]>();
        res.data.docs.map((el)=>{
          if (el.image && el.image != "null") {
            el.image =this.baseUrl +  el.image;
          }
        });
        this.dataSource = new MatTableDataSource(res.data.docs);
      }

    });

    //Get Nurses
    this.commonServ.getAllNurses(data1).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.docs.map((el) => {
          if (el.image && el.image != "null") {
            el.image = this.baseUrl + el.image;
          }
        });
        this.nurseDataSource = new MatTableDataSource(res.data.docs);
      }
    });

    //All Others Users
    this.commonServ.getAllOthers(data1).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.docs.map((el) => {
          if (el.image && el.image != "null") {
            el.image = this.baseUrl + el.image;
          }
        });
        this.othersDataSource = new MatTableDataSource(res.data.docs);
      }
    });
  }

  applyFilter(filterValue: any) {
    if (this.selectedUserType == 1) {
      this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
    if (this.selectedUserType == 2) {
      this.nurseDataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
    if (this.selectedUserType == 3) {
      this.othersDataSource.filter = filterValue.target.value.trim().toLowerCase();
    }
  }

  selectHandler(row: any) {
    this.selection.toggle(row);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getDummyImage(role: string) {
    return this.commonServ.getDummyImage(role);
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

  fetchAllGroups() {
    this.allGroupsChat = new MatTableDataSource<any[]>();
    let data = {
      senderId:this.loggedInUserId
    };
    this.webSocketService.fetchChats(data);
    
    this.webSocketService.userData().subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        res.data.map((el) => {
          if(!el.isGroupChat){
            el.users.forEach(element => {
              let chatName = [];
              el.users.forEach(element => {
                chatName.push(element.name);
              });
              el.chatName = chatName.join(', ');
              el.role = element.role;
            });
          }
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

  applyFilterToChat(filterValue: any) {
    if (this.selectedTab == 1) {
      this.allGroupsChat.filter = filterValue.target.value.trim().toLowerCase();
    }
  }
}
