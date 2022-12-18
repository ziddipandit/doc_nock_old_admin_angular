import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginInterface, ApiResponse, UserInfo, ForgotInterface, ResetInterface, ValidateToken } from 'src/app/interfaces/auth-interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  apiUrl = environment.apiUrl;

  public userInfo: BehaviorSubject<UserInfo>;
  private token: any;
  public user: Observable<UserInfo>;

  role: string = "";

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) { 
    this.userInfo = new BehaviorSubject<UserInfo>(this.getUserDetails());
    this.user = this.userInfo.asObservable();
  }

  public login(credentials: LoginInterface){
    return this.http.post<ApiResponse>(this.apiUrl + 'login', credentials, this.httpOptions);
  }

  public forgotPassword(data: ForgotInterface){
    return this.http.post<ApiResponse>(this.apiUrl + 'auth/forgot-password', data);
  }

  public validateToken(data: ValidateToken){
    return this.http.post<ApiResponse>(this.apiUrl + 'verify-token', data);
  }

  public resetPassword(data: ResetInterface){
    return this.http.post<ApiResponse>(this.apiUrl + 'auth/create-password', data);
  }


  set(token: string){
    localStorage.setItem('access_token', token);
  }

  setNursingId(token: string){
     localStorage.setItem('nursingID',JSON.stringify(token));
  }

  get(){
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  setTokenAndUserInfo(userDetails: any){
    this.token = null;
    this.set(userDetails.token);
    if(userDetails.nursingId)
    this.setNursingId(userDetails.nursingId);
    return true;
  }

  isUserLoggedIn(){
    return this.get() !== null;
  }

  getRole(){
    let role = '';
    this.user.subscribe((res: any) => {
      role = res.role;
    });
    return role;
  }

  redirectTo(){
    const role = this.getRole();
    if(role != undefined && role != null && role != ""){
      return `${role.split('_').join('-')}/dashboard`;
    }
    return '';
  }
  
  logout(){
    let obj: any = {};
    this.token = null;
    this.userInfo.next(obj);
    localStorage.clear();
  }

  public getUserDetails() {
    let token = this.get();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  getUserImage(){
    const baseUrl = environment.apiUrl;
    let userImage = '';
    this.user.subscribe(res => {
      if(res != null && res.image != undefined && res.image != null){
        userImage = baseUrl + res.image;
      }
    });
    return userImage;
  }

  getSetupProfileDetails(data: any){
    return this.http.post(this.apiUrl + 'setup-profile-user', data);
  }

  submitSetupProfileDetails(data: any){
    return this.http.put(this.apiUrl + 'profileUpdate', data);
  }

  getLoggedInUserId(){
    let userId: string;
    if(this.isUserLoggedIn()){
      this.user.subscribe((res: any) => {
        userId = res._id;
      });
    }
    return userId;
  }
}
