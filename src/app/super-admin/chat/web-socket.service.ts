import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

private socket = io(environment.apiUrl);
  constructor() { }

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  newMessageReceived() {
    const observable = new Observable<{ user: String, message: String}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  fetchChats(data){
    this.socket.emit('fetch-chats', data);
  }

  typing(data) {
    this.socket.emit('typing', data);
  }

  receivedTyping() {
    const observable = new Observable<{ isTyping: boolean}>(observer => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  userData() {
    const observable = new Observable<{ user:String}>(observer => {
      this.socket.on('chat-history', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  accessChat(data: any){
    this.socket.emit('access-chat', data);
  }

  accessUserChat() {
    const observable = new Observable<{ user:String}>(observer => {
      this.socket.on('access-user-chat', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  createGroup(data: any){
    this.socket.emit('create-group', data);
  }

  accessGroupInfo() {
    const observable = new Observable<{ user:String}>(observer => {
      this.socket.on('access-user-group', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
