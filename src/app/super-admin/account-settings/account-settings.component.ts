import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  userImage: any;
  userInfo: any;
  baseUrl = environment.apiUrl;
  accountSettingForm: any;
  ImageToUpload: any;
  selectedTab: number = 1;
  changePasswordForm: any;
  submitDisabled: boolean = true;
  notMatchedMessage: string = "Password does not match.";
  showNotMatchedMessage: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private commonServ: CommonService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe((res: any) => {
      if(res != null){
        this.userInfo = res;
        if(res.image != undefined && res.image != null){
          this.userImage = this.baseUrl + res.image;
        }
      }
    });
    this.initializeAccountSettingForm();
    this.initializeChangePasswordForm();
  }

  toggleSelectedTab(tabIndex: number){
    this.selectedTab = tabIndex;
  }

  initializeAccountSettingForm(): void {
    this.accountSettingForm = this.fb.group({
      name: [this.userInfo.name, [Validators.required]],
      email: [this.userInfo.email, []],
      image: []
    });
  }

  initializeChangePasswordForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formControls(): any {
    return this.changePasswordForm.controls;
  }

  openFileSelector(){
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
  }
  
  fileChange(event: any){
    this.ImageToUpload = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.userImage = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  updateAccount(){
    const formValues: any = new FormData();
    if(this.accountSettingForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    formValues.append("name",this.accountSettingForm.get("name").value);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    }

    this.commonServ.updateProfile(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.authService.setTokenAndUserInfo(res.data);
        this.toastr.success(res.message, '', {
          timeOut: 1000,
        });
        this.router.navigateByUrl('/admin/dashboard')

        if (this.authService.isUserLoggedIn()) {
          this.authService.userInfo.next(this.authService.getUserDetails());
        }
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  updatePassword(){
    if(this.changePasswordForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }

    let formValues = {
      oldPassword: this.changePasswordForm.get("oldPassword").value,
      newPassword: this.changePasswordForm.get("newPassword").value
    };
    this.commonServ.changePassword(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.initializeChangePasswordForm();
        this.toastr.success(res.message);
        this.router.navigateByUrl('/admin/dashboard')
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  validatePassword(): void{
    this.submitDisabled = true;
    this.showNotMatchedMessage = false;
    const formValues: any = this.changePasswordForm.value;
    const isFormValid: boolean = this.changePasswordForm.valid;
    if(!isFormValid){
      this.submitDisabled = true;
    }
    if(isFormValid){
      if(formValues.newPassword != '' && (formValues.newPassword != formValues.confirm_password)){
        this.showNotMatchedMessage = this.submitDisabled = true;
      }
      if((formValues.newPassword != '' && formValues.confirm_password != '') && (formValues.newPassword === formValues.confirm_password)){
        this.showNotMatchedMessage = this.submitDisabled = false;
      }
    }
  }
}