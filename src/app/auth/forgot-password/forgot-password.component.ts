import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, ForgotInterface, ResultType } from 'src/app/interfaces/auth-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForgotPasswordForm();
  }

  initializeForgotPasswordForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  } 

  get formControls(): any {
    return this.forgotPasswordForm.controls;
  }

  submitForgotForm(){
    const formValues: ForgotInterface = this.forgotPasswordForm.value;
    if(this.forgotPasswordForm.invalid){
      this.toastr.error('Form is invalid');
      return ;
    }
    this.authService.forgotPassword(formValues).subscribe((res: ApiResponse) => {
      if(res.messageID == ResultType.SUCCESS){
        this.initializeForgotPasswordForm();
        this.router.navigateByUrl('login');
        this.toastr.success(res.message, '', {
          timeOut: 3000
        });
      } else {
        this.toastr.error(res.message);
      }
    });
  }

}
