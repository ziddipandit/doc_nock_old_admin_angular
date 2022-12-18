import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ResetInterface, ResultType, ValidateToken } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: any;
  password: string;
  confirm_password: string;
  token: string;
  submitDisabled: boolean = true;
  notMatchedMessage: string = "Password does not match.";
  showNotMatchedMessage: boolean = false;
  isTokenValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.password = "password";
    this.confirm_password = "password";
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
      if(this.token == undefined || this.token == '' || this.token == null){
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      } else {
        this.validateToken(this.token);
      }
    });
    this.initializeResetPasswordForm();
  }

   validateToken(token: string){
    const data: ValidateToken = {token: token};
    this.authService.validateToken(data).subscribe((res: ApiResponse) => {
      if (res.messageID == 200) {
        this.isTokenValid = true;
      } else if (res.messageID == 201) {
        this.isTokenValid = false;
        this.toastr.error(res.message, '', {
          timeOut: 2000
        });
        this.router.navigate(['/setup-profile', this.token]);
      } else {
        this.isTokenValid = false;
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      }
    });
  }

  initializeResetPasswordForm(): void {
    this.resetPasswordForm = this.fb.group({
      token: [this.token, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

  get formControls(): any {
    return this.resetPasswordForm.controls;
  }

  submitResetForm(){
    const formValues: ResetInterface = this.resetPasswordForm.value;
    this.validatePassword();
    if(this.resetPasswordForm.invalid || this.submitDisabled){
      this.toastr.error('Form is invalid');
      return ;
    }

    const data: ValidateToken = {token: this.token};
    this.authService.validateToken(data).subscribe((res: ApiResponse) => {
      if (res.messageID == 200) {
        this.authService.resetPassword(formValues).subscribe((res: ApiResponse) => {
          if(res.messageID == ResultType.SUCCESS){
            this.router.navigateByUrl('login');
            this.toastr.success(res.message, '', {
              timeOut: 3000
            });
          } else {
            this.toastr.error(res.message, '', {
              timeOut: 3000
            });
          }
        });
      } else if (res.messageID == 201) {
        this.isTokenValid = false;
        this.toastr.error(res.message, '', {
          timeOut: 2000
        });
        this.router.navigate(['/setup-profile', this.token]);
      } else {
        this.isTokenValid = false;
        this.router.navigateByUrl('login');
        this.toastr.error('Token is not valid', '', {
          timeOut: 2000
        });
      }
    });
  }

  validatePassword(): void{
    this.submitDisabled = true;
    this.showNotMatchedMessage = false;
    const formValues: ResetInterface = this.resetPasswordForm.value;
    const isFormValid: boolean = this.resetPasswordForm.valid;
    if(!isFormValid){
      this.submitDisabled = true;
    }
    if(isFormValid){
      if(formValues.password != '' && (formValues.password != formValues.confirm_password)){
        this.showNotMatchedMessage = this.submitDisabled = true;
      }
      if((formValues.password != '' && formValues.confirm_password != '') && (formValues.password === formValues.confirm_password)){
        this.showNotMatchedMessage = this.submitDisabled = false;
      }
    }
  }
}