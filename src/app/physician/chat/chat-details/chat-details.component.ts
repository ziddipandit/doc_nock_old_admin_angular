import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserInfo, ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { WebSocketService } from 'src/app/super-admin/chat/web-socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit {

  recieverDetails: any;
  isValidChatId: boolean = false;
  loggedInUserId: string;
  baseUrl: any = environment.apiUrl;
  message: string;
  allMessages: any;
  imageURL: any;
  recieverUserImage: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonServ: CommonService,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.webSocketService.newMessageReceived().subscribe(data => {
      this.allMessages.push(data.message);
    });
  }

  ngOnInit(): void {
    this.authService.user.subscribe((res: UserInfo) => {
      if(res != null){
        this.loggedInUserId = res._id;
      if (res.image != undefined) {
        this.imageURL = this.baseUrl + res.image;
      } else {
        this.imageURL = this.getDummyImage(res.role);
      }
      }
    });
    this.activatedRoute.params.subscribe(
      (params: any) => {
        let chatId = params['chatId'];
        this.getChatMessages(chatId);
      }
    );
  }

  getChatMessages(chatId: string){
    const data = {chatId: chatId};
    this.commonServ.getMessages(data).subscribe((res: any) => {
      if (res.messageID == ResultType.SUCCESS) {
        this.isValidChatId = true;
        this.recieverDetails = [res.data.groupData];
        this.recieverDetails.map((el) => {
          if(!el.isGroupChat){
            el.users.forEach(element => {
              if(element._id != this.loggedInUserId){
                el.chatName = element.name;
                if (element.image && element.image != "null") {
                  this.recieverUserImage = this.baseUrl + element.image;
                } else {
                  this.recieverUserImage = this.getDummyImage(element.role);
                }
                el.role = element.role;
              }
            });
          }
        });
        this.recieverDetails = this.recieverDetails[0];
        this.allMessages = res.data.message;
        this.webSocketService.joinRoom({user: this.recieverDetails, room: this.recieverDetails._id});
      } else {
        this.isValidChatId = false;
        this.toastr.error(res.message);
      }
    });
  }

  getDummyImage(role: string) {
    return this.commonServ.getDummyImage(role);
  }

  sendMessage(){
    if(this.message == undefined || this.message == ""){
      this.toastr.error('Please type a message to continue.');
      return;
    }
    const data = {
      chatId: this.recieverDetails._id,
      content: this.message
    };
    this.commonServ.sendMessages(data).subscribe((res: any) => {
    });
    const socketData = {
      content: this.message,
      sender: {
        _id: this.loggedInUserId
      },
      createdAt: new Date()
    };
    this.webSocketService.sendMessage({room: this.recieverDetails._id, user: this.recieverDetails, message: socketData});
    this.message = "";
  }

  formatDate(date: string){
    return this.commonServ.formatDate(date);
  }
}