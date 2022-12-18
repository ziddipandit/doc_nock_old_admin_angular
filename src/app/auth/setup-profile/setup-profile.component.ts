import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResultType, ValidateToken } from 'src/app/interfaces/auth-interfaces';
import { SetupAccount } from 'src/app/interfaces/common-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.scss']
})
export class SetupProfileComponent implements OnInit {

  token: string;
  userImage: any;
  ImageToUpload: any;
  setupProfileForm: any;
  password: string;
  confirm_password: string;
  isFormInvalid: boolean = true;
  notMatchedMessage: string = "Password does not match.";
  showNotMatchedMessage: boolean = false;
  isTokenValid: boolean = false;
  baseUrl: any = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
      if(this.token == undefined || this.token == '' || this.token == null){
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      } else {
        this.validateToken(this.token);
        this.confirm_password = this.password = "password";
        this.initializeSetupProfileForm();
        this.getProfileDetails();
      }
    });
  }

  initializeSetupProfileForm(): void {
    this.setupProfileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', []],
      location: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      image: ['', []],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formControls(): any {
    return this.setupProfileForm.controls;
  }

  validateToken(token: string){
    const data: ValidateToken = {token: token};
    this.authService.validateToken(data).subscribe((res: ApiResponse) => {
      if(res.messageID == 200 || res.messageID == 201){
        this.isTokenValid = true;
      } else {
        this.isTokenValid = false;
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      }
    });
  }

  getProfileDetails(){
    const data: object = {token: this.token};
    this.authService.getSetupProfileDetails(data).subscribe((res: any) => {
      const userData = res.data;
      this.setupProfileForm.patchValue({
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
        location: userData.location,
        image: '',
        password: '',
        confirm_password: ''
      });
      if(userData.image != undefined && userData.image != "null"){
        this.userImage = this.baseUrl + userData.image;
      }
    });
  }

  openFileSelector(){
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
  }
  
  fileChange(event: any){
    const file = event.target.files[0];
    this.ImageToUpload = file;
    if (event.target.files && file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
          this.userImage = event.target.result;
      }
      reader.readAsDataURL(file);
    }
  }

  removeProfilePic(){
    this.userImage = this.ImageToUpload = null;
  }

  togglePassword(){
    if (this.password === 'password'){
      this.password = 'text';
    } else {
      this.password = 'password';
    }
  }

  toggleConfirmPassword(){
    if (this.confirm_password === 'password'){
      this.confirm_password = 'text';
    } else {
      this.confirm_password = 'password';
    }
  }

  validateForm(): void{
    this.isFormInvalid = true;
    this.showNotMatchedMessage = false;
    const formValues: SetupAccount = this.setupProfileForm.value;
    const isFormValid: boolean = this.setupProfileForm.valid;
    if(!isFormValid){
      this.isFormInvalid = true;
    }
    if(isFormValid){
      if(formValues.password != '' && (formValues.password != formValues.confirm_password)){
        this.showNotMatchedMessage = this.isFormInvalid = true;
      }
      if((formValues.password != '' && formValues.confirm_password != '') && (formValues.password === formValues.confirm_password)){
        this.showNotMatchedMessage = this.isFormInvalid = false;
      }
    }
  }

  submitSetupForm(){
    const formData: SetupAccount = this.setupProfileForm.value;
    if(this.setupProfileForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    
    const formValues: any = new FormData();

    formValues.append('name', formData.name);
    formValues.append('location', formData.location);
    formValues.append('contact', formData.contact);
    // formValues.append('password', formData.password);
    formValues.append('password', this.setupProfileForm.get('password').value);
    formValues.append('token', this.token);
    if(this.ImageToUpload != undefined){
      formValues.append('image', this.ImageToUpload);
    }
    
    //Validate Token
    const data: ValidateToken = {token: this.token};
    this.authService.validateToken(data).subscribe((res: ApiResponse) => {
      if(res.messageID == 200 || res.messageID == 201){
        this.authService.submitSetupProfileDetails(formValues).subscribe((res: any) => {
          if (res.messageID == ResultType.SUCCESS) {
            this.authService.setTokenAndUserInfo(res.data);
    
            this.toastr.success(res.message, '', {
              timeOut: 1000,
            });
            if (this.authService.isUserLoggedIn()) {
              this.authService.userInfo.next(this.authService.getUserDetails());
              const redirectUrl = this.authService.redirectTo();
              this.router.navigateByUrl(redirectUrl);
            }
          } else {
            this.toastr.error(res.message);
          }
        });
      } else {
        this.isTokenValid = false;
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      }
    });
  }
}
