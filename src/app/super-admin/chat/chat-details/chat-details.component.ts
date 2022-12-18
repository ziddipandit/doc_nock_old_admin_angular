import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WebSocketService } from '../web-socket.service';


@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit {

  username: String;
  email: String;
  chatroom;
  message: String;
  messageArray: Array<{user: String, message: String}> = [];
  isTyping = false;

  constructor( private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private router: Router,
    private authService: AuthService) {
      this.webSocketService.newMessageReceived().subscribe(data => {
        this.messageArray.push(data);
        this.isTyping = false;
      });

      this.webSocketService.receivedTyping().subscribe(bool => {
        this.isTyping = bool.isTyping;
      });
     }

  
  ngOnInit(): void {
    this.authService.user.subscribe(res => {
      if(res != null){
        this.username = res.name;
      }
    });
    this.webSocketService.joinRoom({user: this.username, room: 4523});
 
  }

  sendMessage() {
    this.webSocketService.sendMessage({room: 4523, user: this.username, message: this.message});
    this.message = '';
  }

  typing() {
    this.webSocketService.typing({room: 4523, user: this.username});
  }

}
