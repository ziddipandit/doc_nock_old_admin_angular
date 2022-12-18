import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss'],
})
export class AllChatsComponent implements OnInit {
  selectedTab: number = 1;

  username: String;
  email: String;
  chatroom;
  message: String;
  messageArray: Array<{ user: String; message: String }> = [];
  isTyping = false;
  chatname = [];
  userList: any;
  userName: any;
  userNameArray = [];

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private router: Router,
    private authService: AuthService,
    private commonServe: CommonService
  ) {
    console.log(this.chatroom);
    this.webSocketService.newMessageReceived().subscribe((data) => {
      this.messageArray.push(data);
      this.isTyping = false;
    });

    this.webSocketService.receivedTyping().subscribe((bool) => {
      this.isTyping = bool.isTyping;
    });
  }

  ngOnInit(): void {
    // this.fetchUsers();
    this.authService.user.subscribe((res) => {
      if (res != null) {
        this.username = res.name;
      }
    });
    this.webSocketService.joinRoom({ user: this.username, room: 4523 });
  }

  sendMessage() {
    this.webSocketService.sendMessage({
      room: 4523,
      user: this.username,
      message: this.message,
    });
    this.message = '';
  }

  typing() {
    this.webSocketService.typing({ room: 4523, user: this.username });
  }

  toggleSelectedTab(tabIndex: number) {
    this.selectedTab = tabIndex;
  }

  // fetchUsers() {
  //   this.commonServe.getUsers().subscribe((res: any) => {
  //     if (res.messageID == ResultType.SUCCESS) {
  //       this.userList = res.data;
  //       this.userList.map((e1) => {
  //         let userName = '';
  //         e1.users.map((e2:any) => {
  //           userName = userName + ', ' + e2.name;
  //         });
          
         
  //         this.userNameArray.push(userName.substring(1));
  //       });
  //     }
  //   });
  // }

  mapNames(data: any){
    return this.commonServe.mapNames(data);
  }
}
