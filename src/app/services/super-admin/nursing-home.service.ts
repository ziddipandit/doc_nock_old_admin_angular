import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/interfaces/auth-interfaces';
import { NursingHome } from 'src/app/interfaces/common-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NursingHomeService {

  apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  add(nursinghomeData: NursingHome){
    return this.http.post<ApiResponse>(this.apiUrl + 'register', nursinghomeData);
  }

  delete(data: any){
    return this.http.post<ApiResponse>(this.apiUrl + 'delete-user', data);
  }

  get(id: string){
    return this.http.post<ApiResponse>(this.apiUrl + 'getUser/'+id, id);
  }

  update(data: any){
    return this.http.post<ApiResponse>(this.apiUrl + 'update-nursinghome', data);
  }
}
