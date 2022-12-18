import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResultType, UserInfo } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { WebSocketService } from 'src/app/super-admin/chat/web-socket.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from 'src/app/services/audio-recording.service';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit, AfterViewChecked  {

  recieverDetails: any;
  isValidChatId: boolean = false;
  loggedInUserId: string;
  baseUrl: any = environment.apiUrl;
  message: string;
  allMessages: any;
  imageURL: any;
  recieverUserImage: string;
  loggedInUserRole: string;
  isMessageImportant: boolean = false;
  showSendOptions: boolean = false;
  attachmentFile: any;
  attachmentToUpload: any;

  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;
  isAudioSent = false;
  audioRecordedTime;
  audioBlobUrl;
  audioBlob;
  audioName;
  audioStream;
  videoStream: MediaStream;
  audioConf = { audio: true}

  @ViewChild("scrollMe", { static: false })
  private myScrollContainer: ElementRef;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private commonServ: CommonService,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {
    this.webSocketService.newMessageReceived().subscribe(data => {
      this.allMessages.push(data.message);
    });
    //Audio Recording
    this.audioRecordingService.recordingFailed().subscribe((res: any) => {
      this.toastr.error(res);
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      var formData = new FormData();
      var blob = new Blob([this.audioBlobUrl], { type: "audio/mp3"});
    formData.append("file", blob);
    this.commonServ.uploadMessageImage(formData).subscribe((res: any) => {
      console.log(res)
    });


      this.ref.detectChanges();

      
      
    });
  }

  ngOnInit(): void {
    this.authService.user.subscribe((res: UserInfo) => {
      if(res != null){
        this.loggedInUserId = res._id;
        this.loggedInUserRole = res.role;
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
        this.showSendOptions = false;
      }
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
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
                if(this.loggedInUserRole == 'admin' || this.loggedInUserRole == 'nursing_home'){
                  el.users.forEach(element => {
                    let chatName = [];
                    el.users.forEach(element => {
                      chatName.push(element.name);
                    });
                    el.chatName = chatName.join(', ');
                  });
                }
              }
            });
          }
          el.chatName = this.formatCHatName(el.chatName)
        });
        this.recieverDetails = this.recieverDetails[0];
        this.allMessages = res.data.message;
        this.webSocketService.joinRoom({user: this.recieverDetails, room: this.recieverDetails._id});
        this.showSendOption();
      } else {
        this.isValidChatId = false;
        this.toastr.error(res.message);
      }
    });
  }

  showSendOption(){
    if(this.loggedInUserRole == 'admin'){
      this.showSendOptions = false;
    } else if(this.loggedInUserRole == 'nursing_home' && this.recieverDetails.isGroupChat){
      this.showSendOptions = true;
    } else if(this.loggedInUserRole == 'nursing_home' && !this.recieverDetails.isGroupChat){
      this.showSendOptions = false;
    } else {
      this.showSendOptions = true;
    }
  }

  formatCHatName(chatName: string){
    if(chatName.length <= 35){
      return chatName;
    } else {
      let name = chatName.split(', ');
      return name[0] + ', ..., '+ name[name.length - 1];
    }
  }

  getDummyImage(role: string) {
    return this.commonServ.getDummyImage(role);
  }

  async sendMessage(){
    if(this.message == undefined || this.message == ""){
      this.toastr.error('Please type a message to continue.');
      return;
    }
    if(this.attachmentFile){
      const res = await this.uploadAttachment();
      console.log('response from functiom is', res);
    }
    console.log('after');
    const socketData = {
      content: this.message,
      isImportant: this.isMessageImportant,
      sender: {
        _id: this.loggedInUserId,
        role: this.loggedInUserRole,
        image: this.imageURL,
        socketData: true
      },
      createdAt: new Date()
    };
    this.webSocketService.sendMessage({room: this.recieverDetails._id, user: this.recieverDetails, message: socketData});
    this.message = "";
    this.isMessageImportant = false;
  }

  uploadAttachment(){
    try{
      console.log('enter');
      const uploadData = new FormData();
      uploadData.append("file", this.attachmentToUpload);
      console.log(uploadData);
      this.commonServ.uploadMessageImage(uploadData).subscribe((res: any) => {
        console.log('resukt is', res);
        return res;
      });
    } catch(err) {
      console.log(err);
    }
  }

  formatDate(date: string){
    return this.commonServ.formatDate(date);
  }

  getSenderProfilePicture(sender: any){
    if(sender.image){
      return this.baseUrl + sender.image;
    }
    return this.getDummyImage(sender.role);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  openFileSelector(){
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
  }

  fileChange(event: any){
    const file = event.target.files[0];
    this.attachmentToUpload = file;
    if (event.target.files && file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.attachmentFile = event.target.result;
      }
      reader.readAsDataURL(file);
    }

    let allowedType = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];
    if (allowedType.indexOf(file.type) != -1) {
      
      
    } else {
      this.attachmentFile = this.attachmentToUpload = undefined;
      this.toastr.error("File selected is not allowed");
    }
  }

  removeAttachedImage(): void {
    this.attachmentFile = this.attachmentToUpload = undefined;
  }

  markMessageAsImportant(){
    this.isMessageImportant = (this.isMessageImportant)? false: true;
  }

  //Audio Recording Functions
  startAudioRecording() {
    this.isAudioRecording = false;
      this.audioBlobUrl = null;
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    } else {
      this.isAudioRecording = false;
      this.audioBlobUrl = null;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  
}