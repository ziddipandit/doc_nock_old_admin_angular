import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from '../../environments/environment'
import { AssistedLiving } from '../interfaces/common-interface';
import { ApiResponse } from '../interfaces/auth-interfaces';

let headerOption = {
  "Content-Type": "application/json"
};


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseURL = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getPhysicianAndNurses(data: any) {
    return this.http.post(this.baseURL + "all-physician-nurses" , data);
  }

  count() {
    return this.http.get(this.baseURL + "count");
  }

  getAssistedLiving(data: any) {
    return this.http.get(`${this.baseURL}all-assistedliving?status=${data.status}`);
  }

  getAllNursingHomes(data: any) {
    return this.http.get(`${this.baseURL}all-nursinghomes?status=${data.status}`);
  }
  
  addAssistedLiving(data: AssistedLiving){
    return this.http.post<ApiResponse>(this.baseURL + 'register', data);
  }

  delete(data: any){
    return this.http.post<ApiResponse>(this.baseURL + 'delete-user', data);
  }

  get(id: string){
    return this.http.post<ApiResponse>(this.baseURL + 'getUser/'+id, id);
  }


  getAllPhysicians(page:any) {
    return this.http.get(`${this.baseURL}all-physicians?nursing_home_id=${page.nursing_home_id}&assissted_living_id=${page.assissted_living_id}` );
  }

  listDashboard(page:any) {
    return this.http.get(`${this.baseURL}dashboard-list?nursing_home_id=${page.nursing_home_id}&assissted_living_id=${page.assissted_living_id}` );
  }
  
  
  getAllOthers(page:any) {
    return this.http.get(`${this.baseURL}other-listing?nursing_home_id=${page.nursing_home_id}` );
  }

  addPhysician(data: any) {
    return this.http.post(this.baseURL + "register" , data);
  }

  addSubadmin(data: any) {
    return this.http.post(this.baseURL + "register" , data);
  }

  getAssistLive() {
    return this.http.get(this.baseURL + "list-assistlive" );
  }

  getursingHomelist() {
    return this.http.get(this.baseURL + "list-nursinghome" );
  }

  deletePhysician(data: any){
    return this.http.post(this.baseURL + 'delete-user', data);
  }

  deleteSubadmin(data: any){
    return this.http.post(this.baseURL + 'delete-user', data);
  }

  updatePhysician(data: any){
    return this.http.post(this.baseURL + 'update-physician', data);
  }

  updateSubadmin(data: any){
    return this.http.post(this.baseURL + 'update-subadmin', data);
  }

  getPhysician(id: string){
    return this.http.post(this.baseURL + 'getUser/'+id, id);
  }

  updateAssistedLivings(data: any){
    return this.http.post(this.baseURL + 'update-assisted-living', data);
  }

  updateGeoLocation(data: any){
    return this.http.put(this.baseURL + 'update-geolocation', data);
  }

  getCurrentUser(data:any){
    return this.http.post(this.baseURL + 'current-user', data)
    
  }
  getAllNurses(page: any) {
    return this.http.get(`${this.baseURL}all-nurses?nursing_home_id=${page.nursing_home_id}&assissted_living_id=${page.assissted_living_id}`);
  }
  


  getAllSubadmin() {
    return this.http.get(`${this.baseURL}all-subadmin`);
  }

  addNurse(data: any) {
    return this.http.post(this.baseURL + "register" , data);
  }

  updateNurse(data: any){
    return this.http.post(this.baseURL + 'update-nurse', data);
  }

  updateProfile(data: any){
    return this.http.post(this.baseURL + 'update-account', data);
  }

  changePassword(data: any){
    return this.http.post(this.baseURL + 'auth/change-password', data);
  }

  mapNames(data: any){
    let name = [];
    data.map((detail) => {
      name.push(detail.name);
    });
    return (name.length > 0)? name.join(', ') : 'NA';
  }

  associatedNures(): any{
    return this.http.get(this.baseURL + 'associated-nurses-list');
  }

  associatedNursingHomes(): any{
    return this.http.get(this.baseURL + 'associated-nursing-homes-list');
  }

  getDummyImage(role: string){
    let imageURL: string;
    if(role == 'nurse'){
      imageURL = "assets/images/nurselogo.png";
    } else if(role == 'physician'){
      imageURL = "assets/images/doctor.png";
    } else if(role == 'group'){
      imageURL = "assets/images/group-icon.jpg";
    } else if(role == 'nursing_home'){
      imageURL = "assets/images/nursing-room.png";
    } else {
      imageURL = "assets/images/user.png";
    }
    return imageURL;
  }

  createGroup(data: any){
    return this.http.post(this.baseURL + 'group', data);
  }

  fetchAllGroups(){
    return this.http.get(this.baseURL + 'fetch-chat');
  }

  updateStatus(data:any){
    return this.http.put(this.baseURL + 'updateStatus', data)
  }

  createChatRoom(data: any){
    return this.http.post(this.baseURL + 'access-chat', data);
  }
  
  getMessages(data: any){
    return this.http.get(this.baseURL + 'get-messages?chatId='+ data.chatId);
  }

  sendMessages(data: any){
    return this.http.post(this.baseURL + 'send-message', data);
  }

  formatDate(date: string){
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(date);
    return `${days[d.getDay()]}, ${this.formatNumber(d.getHours())}:${this.formatNumber(d.getMinutes())}`;
  }

  formatNumber(number: number){
    return (number <= 9)? '0'+number: number;
  }

  uploadMessageImage(data: any){
    return this.http.post(this.baseURL + 'upload-message-image', data);
  }

  associatedUsers(): any{
    return this.http.get(this.baseURL + 'associantedAllData');
  }

  checkImage(imagePath: any, role?: string){
    if(imagePath != undefined){
      let imageUrl = this.baseURL + imagePath;
      let http = new XMLHttpRequest();
      http.open('HEAD', imageUrl, false);
      if(http.status != 404){
        return imageUrl;
      }
    }
    let dummyimageUrl = this.getDummyImage(role);
    return dummyimageUrl;
  }
}